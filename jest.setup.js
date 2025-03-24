// Mock Chart.js
class Chart {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
  }
  
  destroy() {}
  update() {}
}

global.Chart = Chart;

// Mock window.location
delete window.location;
window.location = {
  hash: '',
  href: 'http://localhost',
  pathname: '/',
  search: '',
  replace: jest.fn(),
  reload: jest.fn()
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock requestAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn()
};
global.localStorage = localStorageMock;

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver; 