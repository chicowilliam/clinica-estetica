import json
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "artifacts"
ARTIFACTS.mkdir(exist_ok=True)


def check_page(browser, name, viewport):
    page = browser.new_page(viewport=viewport, device_scale_factor=1, reduced_motion="no-preference")
    console_errors = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: console_errors.append(str(error)))
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
    assert page.evaluate("!window.matchMedia('(prefers-reduced-motion: reduce)').matches")

    assert page.get_by_role("heading", name="Antes de indicar um procedimento, olhamos sua pele de perto.").is_visible()
    assert page.locator("img").count() >= 3
    document_height = page.evaluate("document.documentElement.scrollHeight")
    for scroll_y in range(0, document_height, 600):
        page.evaluate("y => window.scrollTo(0, y)", scroll_y)
        page.wait_for_timeout(80)
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(200)
    assert page.locator("img").evaluate_all("els => els.every(img => img.complete && img.naturalWidth > 0)")
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth")
    assert "Fraunces" in page.locator("h1").evaluate("el => getComputedStyle(el).fontFamily")
    assert "Onest" in page.locator("body").evaluate("el => getComputedStyle(el).fontFamily")

    photo_frames = page.locator("[data-photo-frame]")
    assert photo_frames.count() >= 5
    frame_styles = photo_frames.evaluate_all(
        """els => els.map(el => {
          const style = getComputedStyle(el);
          return {
            topLeft: style.borderTopLeftRadius,
            bottomRight: style.borderBottomRightRadius,
            shadow: style.boxShadow,
            overflow: style.overflow,
          };
        })"""
    )
    assert all(style["topLeft"] == "16px" for style in frame_styles), frame_styles
    assert all(style["bottomRight"] == "56px" for style in frame_styles), frame_styles
    assert all(style["shadow"] != "none" for style in frame_styles), frame_styles
    assert all(style["overflow"] == "hidden" for style in frame_styles), frame_styles
    assert page.locator(".photo-frame > img, .treatment-image, .comparison-image").evaluate_all(
        "els => els.every(el => getComputedStyle(el).filter !== 'none')"
    )

    care_gap = page.locator("#clinica").evaluate(
        """section => {
          const intro = section.querySelector('.body-copy').getBoundingClientRect();
          const sequence = section.querySelector('.care-sequence').getBoundingClientRect();
          return Math.round(sequence.top - intro.bottom);
        }"""
    )
    assert care_gap == 40, care_gap
    care_rule = page.locator(".care-sequence").evaluate(
        "el => ({ left: getComputedStyle(el, '::before').left, right: getComputedStyle(el, '::before').right })"
    )
    assert care_rule == {"left": "24px", "right": "24px"}, care_rule
    assert page.locator(".care-sequence-number").first.evaluate("el => getComputedStyle(el).color") == "rgb(199, 166, 105)"

    if viewport["width"] >= 1024:
        drainage_control = page.get_by_role("tab").filter(has_text="Drenagem linfática")
        drainage_control.click()
        assert page.get_by_role("img", name="Sessão manual de drenagem linfática nas pernas").is_visible()
        active_indicator = page.locator("[data-treatment-active-indicator]")
        assert active_indicator.count() == 1
        assert "rgb(199, 166, 105)" in active_indicator.evaluate("el => getComputedStyle(el).boxShadow")
        treatment_rule = drainage_control.evaluate(
            "el => ({ left: getComputedStyle(el, '::before').left, right: getComputedStyle(el, '::before').right })"
        )
        assert treatment_rule == {"left": "24px", "right": "24px"}, treatment_rule
    else:
        drainage_control = page.locator('[data-slot="accordion-trigger"]').filter(has_text="Drenagem linfática")
        drainage_control.click()
        assert drainage_control.get_attribute("data-state") == "open"
        assert drainage_control.locator("xpath=ancestor::*[@data-slot='accordion-item']").locator("[data-photo-frame='treatment']").is_visible()

    comparator = page.get_by_role("slider", name="Comparar imagem antes e depois")
    comparator.focus()
    comparator.press("ArrowRight")
    assert comparator.input_value() == "51"

    submit = page.get_by_role("button", name="Preparar pedido no WhatsApp")
    submit.click()
    assert page.get_by_text("Confira o telefone: inclua DDD e número.").is_visible()
    assert page.locator("#agendamento input[name=name]").evaluate("el => document.activeElement === el")

    page.get_by_label("Nome").fill("Ana Souza")
    page.get_by_label("Telefone").fill("(11) 98765-4321")
    page.get_by_label("Tratamento de interesse").click()
    page.get_by_role("option", name="Peeling").click()
    page.get_by_label("Dia preferido").fill("2099-09-04")
    page.get_by_label("Horário preferido").fill("14:30")
    submit.click()
    assert page.get_by_role("status").is_visible()
    opened = page.evaluate("window.__openedWindow")
    assert opened and opened["url"].startswith("https://wa.me/")
    assert opened["target"] == "_blank"

    if viewport["width"] < 640:
        menu = page.get_by_role("button", name="Abrir menu")
        menu.click()
        assert page.get_by_role("navigation", name="Navegação móvel").is_visible()
        page.get_by_role("link", name="Tratamentos", exact=True).last.click()
        assert not page.locator("#mobile-nav").is_visible()

    if viewport["width"] >= 1024:
        page.locator("#clinica").scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        page.screenshot(path=str(ARTIFACTS / "desktop-clinic-detail.png"))
        page.locator("#tratamentos").scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        page.screenshot(path=str(ARTIFACTS / "desktop-treatments-detail.png"))

    screenshot = ARTIFACTS / f"{name}.png"
    page.screenshot(path=str(screenshot), full_page=True)
    result = {
        "name": name,
        "viewport": viewport,
        "screenshot": str(screenshot),
        "height": page.evaluate("document.documentElement.scrollHeight"),
        "console_errors": console_errors,
    }
    assert not console_errors, f"Console errors on {name}: {console_errors}"
    page.close()
    return result


def check_reduced_motion(browser):
    page = browser.new_page(viewport={"width": 1280, "height": 800}, reduced_motion="reduce")
    page.goto("http://127.0.0.1:4173", wait_until="networkidle")
    page.locator("#resultados").scroll_into_view_if_needed()
    assert page.locator("html").evaluate("el => getComputedStyle(el).scrollBehavior") == "auto"
    duration = page.locator(".comparison-after").evaluate("el => getComputedStyle(el).animationDuration")
    assert duration in ("0s", "0.00001s", "1e-05s"), duration
    page.close()
    return {"reduced_motion": "verified"}


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(channel="chrome", headless=True)
    results = [
        check_page(browser, "desktop-1440", {"width": 1440, "height": 1000}),
        check_page(browser, "mobile-390", {"width": 390, "height": 844}),
        check_reduced_motion(browser),
    ]
    browser.close()

print(json.dumps(results, ensure_ascii=False, indent=2))
