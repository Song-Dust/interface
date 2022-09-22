import './metamocks';

// https://github.com/cypress-io/cypress/issues/2752#issuecomment-1039285381
Cypress.on('window:before:load', (win) => {
  let copyText: string;
  const readText = () =>
    new Promise<string>((resolve, _reject) => {
      resolve(copyText);
    });
  const writeText = (text: string) =>
    new Promise<void>((resolve, _reject) => {
      copyText = text;
      resolve();
    });

  const clipboardObj = {
    ...win.navigator.clipboard,
    __proto__: {
      readText,
      writeText,
    },
  };
  if (!win.navigator.clipboard) {
    win.navigator.clipboard = clipboardObj;
  }

  win.navigator.clipboard.__proto__.writeText = writeText;
  win.navigator.clipboard.__proto__.readText = readText;
});

beforeEach(() => {
  cy.on('window:before:load', (win) => {
    cy.spy(win.console, 'error').as('spyWinConsoleError');
    cy.spy(win.console, 'warn').as('spyWinConsoleWarn');
  });
});

afterEach(() => {
  // TODO: fix Updater component error and change this to 0
  // cy.get('@spyWinConsoleError').its('callCount').should('lessThan', 2);
  // cy.get('@spyWinConsoleWarn').should('have.callCount', 0);
});

Cypress.Commands.add('connectWallet', () => {
  // TODO: figure out why connect wallet click is needed twice
  cy.get('[data-testid=wallet-connect]').click();
  cy.get('[data-testid=wallet-connect]').click();
});
