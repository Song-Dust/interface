import RoutePath, { getRoute, RouteParam } from '../../src/routes';
import { ArenaHandler } from '../utils/abihandlers/Arena';
import { SupportedChainId } from '../../src/constants/chains';
import { ARENA_ADDRESS, MULTICALL2_ADDRESS } from '../../src/constants/addresses';
import { MulticallAbiHandler } from 'metamocks';
import { IPFS_SERVER_URL, songMeta } from '../utils/data';
import Multicall2Json from '@attentionstreams/contracts/artifacts/contracts/main/multicall.sol/Multicall2.json';

const { abi: Multicall2ABI } = Multicall2Json;

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
    cy.setAbiHandler(MULTICALL2_ADDRESS[SupportedChainId.GOERLI], new MulticallAbiHandler(Multicall2ABI));

    cy.visit(
      getRoute(RoutePath.CATEGORY, {
        [RouteParam.CATEGORY_ID]: String(topicId),
      }),
    );
    cy.get('[data-testid=category-list-item-0]').should('exist');
    cy.get('[data-testid=category-list-item-1]').should('exist');
    cy.get('[data-testid=category-list-item-0-meta]').should('not.exist');
    cy.get('[data-testid=category-list-item-1-meta]').should('exist');
  });
});
