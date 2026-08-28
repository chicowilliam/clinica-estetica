import '@testing-library/jest-dom/vitest'

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]

  disconnect() {}
  observe() {}
  takeRecords() { return [] }
  unobserve() {}
}

class MockResizeObserver implements ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})
Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
})

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    }),
  })

  HTMLElement.prototype.scrollIntoView = () => undefined
  HTMLElement.prototype.hasPointerCapture = () => false
  HTMLElement.prototype.setPointerCapture = () => undefined
  HTMLElement.prototype.releasePointerCapture = () => undefined
}
