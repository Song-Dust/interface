import { TEST_ADDRESS_NEVER_USE_SHORTENED } from '../utils/data';

describe('Wallet', () => {
  beforeEach(() => {
    cy.setupMetamocks();
  });

  it('eager connects wallet', () => {
    cy.visit('/');
    cy.connectWallet();
    cy.get('[data-testid=wallet-connect]').contains(TEST_ADDRESS_NEVER_USE_SHORTENED);
  });
});
