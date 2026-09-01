import json
import re
import sys
from pathlib import Path

from playwright.sync_api import Locator, Page, sync_playwright


ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "artifacts" / "ux-release"
ARTIFACTS.mkdir(parents=True, exist_ok=True)


def rect(locator: Locator):
    box = locator.bounding_box()
    assert box is not None
    return box


def overlaps(first, second):
    return not (
        first["x"] + first["width"] <= second["x"]
        or second["x"] + second["width"] <= first["x"]
        or first["y"] + first["height"] <= second["y"]
        or second["y"] + second["height"] <= first["y"]
    )


def swipe_touch(page: Page, locator: Locator, start_ratio=0.82, end_ratio=0.18):
    """Dispatch a real Chromium touch sequence instead of emulating mouse drag."""
    box = rect(locator)
    start_x = box["x"] + box["width"] * start_ratio
    end_x = box["x"] + box["width"] * end_ratio
    y = box["y"] + box["height"] * 0.5
    session = page.context.new_cdp_session(page)
    try:
        session.send(
            "Input.dispatchTouchEvent",
            {
                "type": "touchStart",
                "touchPoints": [{"x": start_x, "y": y, "radiusX": 5, "radiusY": 5, "force": 1}],
            },
        )
        for step in range(1, 9):
            x = start_x + (end_x - start_x) * step / 8
            session.send(
                "Input.dispatchTouchEvent",
                {
                    "type": "touchMove",
                    "touchPoints": [{"x": x, "y": y, "radiusX": 5, "radiusY": 5, "force": 1}],
                },
            )
            page.wait_for_timeout(16)
        session.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
    finally:
        session.detach()


def assert_document_fits(page: Page):
    assert page.evaluate(
        "document.documentElement.scrollWidth <= document.documentElement.clientWidth"
    )


def validate_viewport(browser, name, viewport):
    is_mobile = viewport["width"] <= 767
    context = browser.new_context(
        viewport=viewport,
        device_scale_factor=1,
        has_touch=is_mobile,
        is_mobile=is_mobile,
    )
    page = context.new_page()
    page.emulate_media(reduced_motion="no-preference")
    console_errors = []
    network_errors = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: console_errors.append(str(error)))
    page.on("requestfailed", lambda request: network_errors.append(f"{request.method} {request.url}"))
    page.on(
        "response",
        lambda response: network_errors.append(f"{response.status} {response.url}")
        if response.url.startswith("http://127.0.0.1:4173") and response.status >= 400
        else None,
    )
    page.add_init_script(
        """
        window.open = (url, target, features) => {
          window.__openedWindow = { url, target, features };
          return null;
        };
        """
    )
    page.goto("http://127.0.0.1:4173", wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(350)

    assert_document_fits(page)
    assert page.locator(".skip-link").count() == 1

    # The only eager image is the above-the-fold hero portrait.
    below_fold_images = page.locator('main img:not([fetchpriority="high"])')
    assert below_fold_images.count() > 0
    assert below_fold_images.evaluate_all(
        "els => els.every(img => img.getAttribute('loading') === 'lazy')"
    )

    header_container = rect(page.locator("[data-header-container]"))
    hairline = rect(page.locator("[data-navbar-hairline]"))
    assert abs(header_container["x"] - hairline["x"]) <= 1, (header_container, hairline)
    assert abs((header_container["x"] + header_container["width"]) - (hairline["x"] + hairline["width"])) <= 1

    hero = page.locator(".hero-section")
    header = rect(page.get_by_role("banner"))
    hero_box = rect(hero)
    assert hero_box["y"] <= header["y"] + header["height"] + 2
    hero_heading = page.get_by_role(
        "heading", name="Antes de indicar um procedimento, olhamos sua pele de perto."
    )
    assert hero_heading.get_attribute("data-fluid-headline") is not None
    assert hero_heading.locator("[data-hero-line]").count() >= 3
    hero_heading_box = rect(hero_heading)
    assert hero_heading_box["x"] >= 0
    assert hero_heading_box["x"] + hero_heading_box["width"] <= viewport["width"] + 1
    hero_gap = hero_heading_box["y"] - (header["y"] + header["height"])
    assert 0 <= hero_gap <= 120, hero_gap
    hero_font_size = hero_heading.evaluate("el => parseFloat(getComputedStyle(el).fontSize)")
    if is_mobile:
        expected_minimum = {360: 48, 375: 50, 412: 52}[viewport["width"]]
        assert expected_minimum <= hero_font_size <= 88, hero_font_size
        assert hero_heading.locator(".word").count() == 0
    else:
        assert 80 <= hero_font_size <= 132, hero_font_size
        assert hero_heading.locator(".word").count() >= 6
    wrapping = hero_heading.evaluate(
        "el => ({ wordBreak: getComputedStyle(el).wordBreak, overflowWrap: getComputedStyle(el).overflowWrap })"
    )
    assert wrapping["wordBreak"] != "break-all"
    assert wrapping["overflowWrap"] != "anywhere"
    assert hero_heading.locator("em").count() == 1
    assert hero_heading.locator("[data-annotation], [data-hero-highlight]").count() == 0
    assert page.locator(".hero-proof > div").count() == 3
    hero.screenshot(path=str(ARTIFACTS / f"{name}-hero.png"))

    # Mobile navigation is a real modal surface: full viewport, keyboard dismissible,
    # focus-restoring and with touch-sized links.
    menu_trigger = page.get_by_role("button", name="Abrir menu")
    if is_mobile:
        trigger_box = rect(menu_trigger)
        assert trigger_box["width"] >= 44 and trigger_box["height"] >= 44
        menu_trigger.click()
        mobile_dialog = page.get_by_role("dialog", name="Navegação móvel")
        mobile_dialog.wait_for(state="visible")
        dialog_box = rect(mobile_dialog)
        assert dialog_box["width"] >= viewport["width"] * 0.98, dialog_box
        assert dialog_box["height"] >= viewport["height"] * 0.95, dialog_box
        assert mobile_dialog.get_attribute("aria-modal") == "true"
        assert page.evaluate("getComputedStyle(document.body).overflow") == "hidden"
        menu_links = mobile_dialog.get_by_role("link")
        assert menu_links.count() >= 6
        menu_hit_sizes = menu_links.evaluate_all(
            "els => els.map(el => ({w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height}))"
        )
        assert all(item["w"] >= 44 and item["h"] >= 44 for item in menu_hit_sizes), menu_hit_sizes
        assert mobile_dialog.evaluate("dialog => dialog.contains(document.activeElement)")
        mobile_dialog.screenshot(path=str(ARTIFACTS / f"{name}-menu.png"))
        page.keyboard.press("Escape")
        mobile_dialog.wait_for(state="detached")
        assert menu_trigger.get_attribute("aria-expanded") == "false"
        assert menu_trigger.evaluate("el => el === document.activeElement")
    else:
        assert not menu_trigger.is_visible()
        assert page.get_by_role("dialog", name="Navegação móvel").count() == 0

    # Exactly one dark interlude and one restrained marquee.
    contrast = page.locator("[data-contrast-section]")
    assert contrast.count() == 1
    contrast.scroll_into_view_if_needed()
    assert contrast.evaluate("el => getComputedStyle(el).backgroundColor") == "rgb(58, 34, 38)"
    assert contrast.locator("dl > div").count() >= 3
    marquee = page.locator("[data-marquee]")
    assert marquee.count() == 1
    assert marquee.get_attribute("aria-label") == "Tratamentos em movimento"
    marquee_tracks = marquee.locator("[data-marquee-track]")
    assert marquee_tracks.count() == 2
    assert marquee.locator('[data-marquee-track]:not([aria-hidden="true"])').count() == 1
    assert marquee.locator('[data-marquee-track][aria-hidden="true"]').count() == 1
    marquee_rail = marquee.locator("[data-marquee-rail]")
    assert marquee.get_attribute("data-motion-mode") == ("light" if is_mobile else "full")
    marquee.scroll_into_view_if_needed()
    if is_mobile:
        duration = marquee_rail.evaluate("el => parseFloat(getComputedStyle(el).animationDuration)")
        assert duration >= 30, duration
    else:
        page.wait_for_timeout(350)
        assert marquee_rail.evaluate("el => getComputedStyle(el).transform") != "none"
    contrast.screenshot(path=str(ARTIFACTS / f"{name}-contrast.png"))

    # Desktop motion is dynamically mounted only for a fine pointer.
    desktop_cursor = page.locator("[data-desktop-cursor]")
    desktop_effects_state = page.locator("html").get_attribute("data-desktop-effects")
    lenis_state = page.locator("html").get_attribute("data-lenis-active")
    if is_mobile:
        assert desktop_cursor.count() == 0
        assert desktop_effects_state != "true"
        assert lenis_state != "true"
        loaded_resources = page.evaluate(
            "performance.getEntriesByType('resource').map(entry => entry.name)"
        )
        assert not any("DesktopExperience-" in resource for resource in loaded_resources), loaded_resources
    else:
        desktop_cursor.wait_for(state="attached")
        assert desktop_effects_state == "true"
        assert lenis_state == "true"
        assert desktop_cursor.evaluate("el => getComputedStyle(el).pointerEvents") == "none"
        magnetic_targets = page.locator("[data-magnetic]:visible")
        assert magnetic_targets.count() >= 2
        target = magnetic_targets.first
        target.scroll_into_view_if_needed()
        target_box = rect(target)
        page.mouse.move(target_box["x"] + target_box["width"] - 3, target_box["y"] + target_box["height"] / 2)
        page.wait_for_timeout(180)
        assert desktop_cursor.get_attribute("data-active") == "true"
        assert target.evaluate("el => getComputedStyle(el).transform") != "none"

    results = page.locator("#resultados")
    results.scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    assert page.get_by_role("banner").get_attribute("data-floating") == "false"
    comparator = page.get_by_role("slider", name="Comparar imagem antes e depois")
    comparison = rect(page.locator(".comparison"))
    content = rect(results.locator(".page-grid"))
    portrait_window = rect(page.locator(".comparison-portrait-window").first)
    assert comparison["width"] <= content["width"] + 1
    assert comparison["height"] <= viewport["height"] * 0.75 + 1
    assert abs(comparison["width"] - portrait_window["width"]) <= 3
    assert abs(comparison["height"] - portrait_window["height"]) <= 3
    assert page.locator(".comparison").evaluate("el => getComputedStyle(el).isolation") == "isolate"
    comparison_progress = page.locator("[data-comparison-progress]")
    assert comparison_progress.is_visible()
    assert "50%" in comparison_progress.inner_text()
    comparator.focus()
    comparator.press("ArrowRight")
    assert comparator.input_value() == "51"
    assert "51%" in comparison_progress.inner_text()
    if is_mobile:
        before_touch = int(comparator.input_value())
        swipe_touch(page, comparator, start_ratio=0.22, end_ratio=0.78)
        page.wait_for_timeout(180)
        after_touch = int(comparator.input_value())
        assert abs(after_touch - before_touch) >= 10, (before_touch, after_touch)
        assert f"{after_touch}%" in comparison_progress.inner_text()
    results.screenshot(path=str(ARTIFACTS / f"{name}-slider.png"))

    testimonials = page.get_by_role("region", name="Relatos de pacientes")
    testimonials.scroll_into_view_if_needed()
    page.wait_for_timeout(250)
    testimonial_progress = testimonials.get_by_role("progressbar", name="Progresso dos relatos")
    assert testimonial_progress.is_visible()
    assert testimonial_progress.get_attribute("aria-valuenow") == "1"
    if is_mobile:
        testimonial_viewport = testimonials.locator(".testimonial-viewport")
        assert "pan-y" in testimonial_viewport.evaluate("el => getComputedStyle(el).touchAction")
        swipe_touch(page, testimonial_viewport)
        page.wait_for_function(
            "el => el.getAttribute('aria-valuenow') !== '1'",
            arg=testimonial_progress.element_handle(),
        )
        assert int(testimonial_progress.get_attribute("aria-valuenow")) > 1

    # Mobile WhatsApp stays in the thumb zone and must not obscure the booking CTA.
    whatsapp_dock = page.locator("[data-whatsapp-dock]")
    if is_mobile:
        assert whatsapp_dock.is_visible()
        assert whatsapp_dock.get_attribute("data-slot") == "button"
        assert whatsapp_dock.get_attribute("href").startswith("https://wa.me/")
        assert whatsapp_dock.evaluate("el => getComputedStyle(el).position") == "fixed"
        dock_box = rect(whatsapp_dock)
        safe_bottom = viewport["height"] - (dock_box["y"] + dock_box["height"])
        assert 8 <= safe_bottom <= 56, safe_bottom
        assert dock_box["width"] >= 44 and dock_box["height"] >= 44
    else:
        assert whatsapp_dock.count() == 0 or not whatsapp_dock.is_visible()

    booking = page.locator("#agendamento")
    booking.scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    assert page.locator('input[type="date"]').count() == 0
    assert page.locator('input[type="time"]').count() == 0
    assert page.locator('[data-slot="calendar"]').count() == 0
    assert page.locator(".booking-progress li").count() == 3
    assert page.locator('.booking-progress li[data-state="active"]').inner_text().startswith("01")
    assert page.locator(".booking-aside").evaluate("el => getComputedStyle(el).boxShadow") != "none"
    if is_mobile and whatsapp_dock.is_visible():
        booking_cta = page.get_by_role("button", name="Continuar para data e horário")
        assert not overlaps(rect(whatsapp_dock), rect(booking_cta))

    page.get_by_label("Tratamento de interesse").click()
    page.get_by_role("option", name=re.compile(r"^Peeling")).click()
    page.get_by_role("button", name="Continuar para data e horário").click()
    calendar = page.locator('[data-slot="calendar"]')
    assert calendar.is_visible()
    available_day = page.locator("[data-booking-day]:not([disabled])").first
    available_day.click()
    time_grid = page.locator("[data-booking-time-grid]")
    assert time_grid.is_visible()
    time_grid.locator('[data-slot="button"]').first.click()
    assert time_grid.locator('[aria-pressed="true"]').count() == 1
    page.get_by_role("button", name="Continuar para seus dados").click()
    page.get_by_label("Nome").fill("Ana Souza")
    page.get_by_label("Telefone").fill("(11) 98765-4321")
    page.get_by_role("button", name="Enviar pedido de horário").click()
    assert page.get_by_text(re.compile(r"^Pedido preparado\.")).is_visible()
    opened = page.evaluate("window.__openedWindow")
    assert opened and opened["url"].startswith("https://wa.me/")
    assert page.locator('.booking-progress li[data-state="complete"]').count() == 2
    booking.screenshot(path=str(ARTIFACTS / f"{name}-booking.png"))

    allowed_variants = {"primary", "secondary", "ghost"}
    visible_buttons = page.locator('[data-slot="button"]:visible')
    variants = visible_buttons.evaluate_all("els => els.map(el => el.dataset.variant)")
    assert variants and all(variant in allowed_variants for variant in variants), variants
    hit_sizes = visible_buttons.evaluate_all(
        "els => els.filter(el => !el.disabled).map(el => ({w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height}))"
    )
    assert all(item["w"] >= 44 and item["h"] >= 44 for item in hit_sizes), hit_sizes

    contact = page.locator("#contato")
    contact.scroll_into_view_if_needed()
    page.wait_for_timeout(250)
    assert page.locator(".map-callout").is_visible()
    assert page.locator(".map-blocks path").count() >= 12
    assert page.locator(".map-streets path").count() >= 6
    assert page.locator(".map-park").is_visible()
    assert page.locator(".map-clinic-pin").is_visible()
    contact.screenshot(path=str(ARTIFACTS / f"{name}-map.png"))

    assert page.locator(".site-footer").is_visible()
    assert_document_fits(page)
    page.locator("img").last.scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    assert page.locator("img").evaluate_all("els => els.every(img => img.complete && img.naturalWidth > 0)")
    assert not console_errors, console_errors
    assert not network_errors, network_errors
    page.screenshot(path=str(ARTIFACTS / f"{name}-full.png"), full_page=True)

    result = {
        "name": name,
        "viewport": viewport,
        "hero_font_size": round(hero_font_size, 1),
        "comparison": {"width": round(comparison["width"]), "height": round(comparison["height"])},
        "hairline": {"left": round(hairline["x"]), "right": round(hairline["x"] + hairline["width"])},
        "hero_heading_gap": round(hero_gap),
        "desktop_effects": desktop_effects_state,
        "buttons": len(variants),
        "console_errors": console_errors,
        "network_errors": network_errors,
    }
    context.close()
    return result


viewports = [
    ("mobile-360", {"width": 360, "height": 800}),
    ("mobile-375", {"width": 375, "height": 812}),
    ("mobile-412", {"width": 412, "height": 915}),
    ("desktop-1440", {"width": 1440, "height": 900}),
]
requested = set(sys.argv[1:])
if requested:
    viewports = [viewport for viewport in viewports if viewport[0] in requested]
    assert viewports, f"Nenhum viewport conhecido em: {sorted(requested)}"

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(channel="chrome", headless=True)
    results = [validate_viewport(browser, name, viewport) for name, viewport in viewports]
    browser.close()

print(json.dumps(results, ensure_ascii=False, indent=2))
