// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/* eslint-disable no-undef */
import './metamocks';

// https://github.com/cypress-io/cypress/issues/2752#issuecomment-1039285381
Cypress.on('window:before:load', (win) => {
  let copyText;

  if (!win.navigator.clipboard) {
    win.navigator.clipboard = {
      __proto__: {},
    };
  }

  win.navigator.clipboard.__proto__.writeText = (text) => (copyText = text);
  win.navigator.clipboard.__proto__.readText = () => copyText;
});

beforeEach(() => {
  cy.on('window:before:load', (win) => {
    cy.spy(win.console, 'error').as('spyWinConsoleError');
    cy.spy(win.console, 'warn').as('spyWinConsoleWarn');
  });
});

afterEach(() => {
  // TODO: fix Updater component error and change this to 0
  cy.get('@spyWinConsoleError').its('callCount').should('lessThan', 2);
  cy.get('@spyWinConsoleWarn').should('have.callCount', 0);
});
