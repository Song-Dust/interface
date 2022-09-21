import { ARENA_ADDRESS, MULTICALL_ADDRESS, SONG_ADDRESS } from '../../src/constants/addresses';
import { SupportedChainId } from '../../src/constants/chains';
import RoutePath, { getRoute, RouteParam } from '../../src/routes';
import { ArenaHandler } from '../utils/abihandlers/Arena';
import MulticallUniswapAbiHandler from '../utils/abihandlers/MulticallUniswapInterface';
import { SongAbiHandler } from '../utils/abihandlers/Song';
import { IPFS_SERVER_URL, songMeta } from '../utils/data';

describe('Category', () => {
  const categoryId = 0;

  beforeEach(() => {
    cy.intercept(
      {
        url: `${IPFS_SERVER_URL}**`,
      },
      {
        statusCode: 404,
      },
    );
    cy.intercept(
      {
        url: `${IPFS_SERVER_URL}/choice/2.json`,
      },
      {
        body: songMeta,
      },
    );
    cy.setupMetamocks();
    cy.registerHandler(ARENA_ADDRESS[SupportedChainId.GOERLI], ArenaHandler);
    cy.registerHandler(SONG_ADDRESS[SupportedChainId.GOERLI], SongAbiHandler);
    cy.registerHandler(MULTICALL_ADDRESS[SupportedChainId.GOERLI], MulticallUniswapAbiHandler);
    cy.visit(
      getRoute(RoutePath.CATEGORY, {
        [RouteParam.CATEGORY_ID]: String(categoryId),
      }),
    );
    cy.connectWallet();
  });

  it('loads songs', () => {
    cy.get('[data-testid=category-list-item-0]').should('exist');
    cy.get('[data-testid=category-list-item-1]').should('exist');
    cy.get('[data-testid=category-list-item-0-meta]').should('not.exist');
    cy.get('[data-testid=category-list-item-1-meta]').should('exist');
  });

  it.only('votes for a song', () => {
    cy.get('[data-testid=open-vote-modal]').click();
    cy.get('[data-testid=category-list-item-1-choose]').click();
    cy.get('[data-testid=cast-vote-btn]').contains('Enter');
    cy.get('[data-testid=vote-amount-max]').click();
    cy.get('[data-testid=vote-amount-input]').should('have.value', 0.01);
    cy.get('[data-testid=cast-vote-btn]').contains('Approve');
  });
});
