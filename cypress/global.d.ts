export {};

declare global {
  namespace Cypress {
    interface Chainable {
      connectWallet(): void;
    }

    interface Window {
      navigator: {
        clipboard: {
          __proto__: {
            readText(): Promise<string>;
            writeText(text: string): Promise<void>;
          };
        };
      };
    }
  }
}
