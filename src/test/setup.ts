import '@testing-library/jest-dom';
import { server } from './mocks/server';

// ── ResizeObserver mock ───────────────────────────────────────────────────────
// react-photo-album relies on ResizeObserver to measure container width.
class ResizeObserverMock {
  private cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) { this.cb = cb; }
  observe(target: Element) {
    this.cb(
      [{
        target,
        contentRect: { width: 800, height: 0, top: 0, left: 0, right: 800, bottom: 0, x: 0, y: 0 },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as unknown as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

// ── Touch / TouchEvent polyfills ──────────────────────────────────────────────
// jsdom does not expose Touch/TouchEvent as globals; these minimal polyfills
// allow touch event tests to run without errors from react-remove-scroll.
if (typeof globalThis.Touch === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Touch = class {
    [key: string]: unknown;
    constructor(init: Record<string, unknown>) { Object.assign(this, init); }
  };
}

if (typeof globalThis.TouchEvent === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).TouchEvent = class extends Event {
    touches: unknown[];
    changedTouches: unknown[];
    constructor(type: string, init: Record<string, unknown> = {}) {
      super(type, { bubbles: true, cancelable: true, ...init });
      this.touches = (init.touches as unknown[]) ?? [];
      this.changedTouches = (init.changedTouches as unknown[]) ?? [];
    }
  };
}

// ── MSW ───────────────────────────────────────────────────────────────────────
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
