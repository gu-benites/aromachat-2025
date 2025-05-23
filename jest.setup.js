// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => Promise.resolve()),
    };
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock ResizeObserver
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverStub;

// Mock IntersectionObserver
class IntersectionObserverStub {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserverStub;

// Mock fetch
// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock console methods
const consoleError = console.error;
const consoleWarn = console.warn;

beforeAll(() => {
  // Suppress specific warnings/errors in test output
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    // Ignore specific warnings/errors
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: useLayoutEffect does nothing on the server') ||
        args[0].includes('Warning: An update to %s inside a test was not wrapped in act'))
    ) {
      return;
    }
    consoleError(...args);
  });

  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    // Ignore specific warnings
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React does not recognize the `%s` prop on a DOM element')
    ) {
      return;
    }
    consoleWarn(...args);
  });
});

afterEach(() => {
  // Clear all mocks after each test
  jest.clearAllMocks();
  // Reset any manual mocks
  // @ts-ignore
  global.fetch.mockClear();
});

afterAll(() => {
  // Restore original console methods
  jest.restoreAllMocks();
});
