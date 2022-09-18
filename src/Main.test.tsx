import { render } from '@testing-library/react';
import React from 'react';

import Main from './Main';

describe('app', () => {
  test('renders app', () => {
    global.console = { ...global.console, warn: jest.fn(), error: jest.fn() };
    window.matchMedia = (_query: string) => ({
      addEventListener: jest.fn(),
      addListener: jest.fn(),
      dispatchEvent: jest.fn(),
      removeEventListener: jest.fn(),
      removeListener: jest.fn(),
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
    });
    render(<Main />);
    expect(console.warn).not.toBeCalled();
    expect(console.error).not.toBeCalled();
  });
});
