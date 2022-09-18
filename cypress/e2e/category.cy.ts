import { ARENA_ADDRESS, MULTICALL_ADDRESS, SONG_ADDRESS } from '../../src/constants/addresses';
import { SupportedChainId } from '../../src/constants/chains';
import RoutePath, { getRoute, RouteParam } from '../../src/routes';
import { ArenaHandler } from '../utils/abihandlers/Arena';
import MulticallUniswapAbiHandler from '../utils/abihandlers/MulticallUniswapInterface';
import SongAbiHandler from '../utils/abihandlers/Song';
import { IPFS_SERVER_URL, songMeta } from '../utils/data';

describe('Category', () => {
  it('loads songs', () => {
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
    const topicId = 0;
    cy.setupMetamocks();
    cy.setAbiHandler(ARENA_ADDRESS[SupportedChainId.GOERLI], new ArenaHandler());
    cy.setAbiHandler(SONG_ADDRESS[SupportedChainId.GOERLI], new SongAbiHandler());
    cy.setAbiHandler(MULTICALL_ADDRESS[SupportedChainId.GOERLI], new MulticallUniswapAbiHandler());

    cy.visit(
      getRoute(RoutePath.CATEGORY, {
        [RouteParam.CATEGORY_ID]: String(topicId),
      }),
    );
    cy.get('[data-testid=wallet-connect]').click();
    cy.get('[data-testid=wallet-connect]').click();
    cy.get('[data-testid=category-list-item-0]').should('exist');
    cy.get('[data-testid=category-list-item-1]').should('exist');
    cy.get('[data-testid=category-list-item-0-meta]').should('not.exist');
    cy.get('[data-testid=category-list-item-1-meta]').should('exist');
  });
});
