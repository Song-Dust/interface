export {};

declare global {
  namespace Cypress {
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
