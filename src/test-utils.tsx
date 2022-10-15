import { render } from '@testing-library/react';
import Web3Provider from 'components/Web3Provider';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from 'state';

const WithProviders = ({ children }: { children?: ReactNode }) => {
  return (
    <Provider store={store}>
      <Web3Provider>{children}</Web3Provider>
    </Provider>
  );
};

const customRender = (ui: ReactElement) => render(ui, { wrapper: WithProviders });

export * from '@testing-library/react';
export { customRender as render };
