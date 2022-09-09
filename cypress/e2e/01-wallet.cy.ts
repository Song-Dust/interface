import { TEST_ADDRESS_NEVER_USE_SHORTENED } from '../utils/data';

describe('Wallet', () => {
  beforeEach(() => {
    cy.setupMetamocks();
  });

  // TODO: figure out why two clicks are needed
  function connect() {
    cy.get('[data-testid=wallet-connect]').click();
    cy.get('[data-testid=wallet-connect]').click();
  }

  it('eager connects wallet', () => {
    cy.visit('/');
    connect();
    cy.get('[data-testid=wallet-connect]').contains(TEST_ADDRESS_NEVER_USE_SHORTENED);
  });
});
