if (typeof window !== 'undefined') {
  if (!window.addEventListener) {
    window.addEventListener = jest.fn();
  }
  if (!window.removeEventListener) {
    window.removeEventListener = jest.fn();
  }
}

