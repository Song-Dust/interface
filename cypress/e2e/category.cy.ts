import { BigNumber } from '@ethersproject/bignumber';

import { ARENA_ADDRESS, MULTICALL_ADDRESS, SONG_ADDRESS } from '../../src/constants/addresses';
import { SupportedChainId } from '../../src/constants/chains';
import RoutePath, { getRoute, RouteParam } from '../../src/routes';
import { Arena } from '../../src/types/contracts';
import { ArenaHandler } from '../utils/abihandlers/Arena';
import MulticallUniswapAbiHandler from '../utils/abihandlers/MulticallUniswapInterface';
import { SongAbiHandler, SongAbiHandlerAllowAll } from '../utils/abihandlers/Song';
import { IPFS_SERVER_URL, songBalance, songMeta } from '../utils/data';

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
    cy.registerAbiHandler(MULTICALL_ADDRESS[SupportedChainId.GOERLI], MulticallUniswapAbiHandler);
  });

  function loadSongs() {
    cy.visit(
      getRoute(RoutePath.CATEGORY, {
        [RouteParam.CATEGORY_ID]: String(categoryId),
      }),
    );
    cy.connectWallet();
  }

  it('loads songs', () => {
    cy.registerAbiHandler(SONG_ADDRESS[SupportedChainId.GOERLI], SongAbiHandler);
    cy.registerAbiHandler(ARENA_ADDRESS[SupportedChainId.GOERLI], ArenaHandler);
    loadSongs();
    cy.get('[data-testid=category-list-item-0]').should('exist');
    cy.get('[data-testid=category-list-item-1]').should('exist');
    cy.get('[data-testid=category-list-item-0-meta]').should('not.exist');
    cy.get('[data-testid=category-list-item-1-meta]').should('exist');
  });

  const selectedSongId = 1;

  function selectSongOne() {
    cy.get('[data-testid=open-vote-modal]').click();
    cy.get(`[data-testid=category-list-item-${selectedSongId}-choose]`).click();
  }

  function useMaxSong() {
    cy.get('[data-testid=cast-vote-btn]').contains('Enter');
    cy.get('[data-testid=vote-amount-max]').click();
    cy.get('[data-testid=vote-amount-input]').should('have.value', 0.01);
  }

  it('gets song balance', () => {
    cy.registerAbiHandler(SONG_ADDRESS[SupportedChainId.GOERLI], SongAbiHandler);
    cy.registerAbiHandler(ARENA_ADDRESS[SupportedChainId.GOERLI], ArenaHandler);
    loadSongs();
    selectSongOne();
    useMaxSong();
  });

  function approveSong() {
    cy.get('[data-testid=cast-vote-btn]').contains('Approve').click();
    cy.get('[data-testid=cast-vote-btn]').contains('Cast');
  }

  it('approves song', () => {
    cy.registerAbiHandler(SONG_ADDRESS[SupportedChainId.GOERLI], SongAbiHandler);
    cy.registerAbiHandler(ARENA_ADDRESS[SupportedChainId.GOERLI], ArenaHandler);
    loadSongs();
    selectSongOne();
    useMaxSong();
    approveSong();
  });

  function submitVote(arenaHandler: ArenaHandler) {
    cy.get('[data-testid=cast-vote-btn]')
      .contains('Cast')
      .click()
      .then(() => {
        expect(arenaHandler.vote).to.have.calledWith([
          BigNumber.from(categoryId),
          BigNumber.from(selectedSongId),
          songBalance,
        ]);
      });
  }

  it('votes for a song', function () {
    cy.registerAbiHandler(SONG_ADDRESS[SupportedChainId.GOERLI], SongAbiHandlerAllowAll);
    const arenaHandler = this.metamocks!.registerAbiHandler<Arena>(
      ARENA_ADDRESS[SupportedChainId.GOERLI],
      ArenaHandler,
    );
    cy.spy(arenaHandler, 'vote');
    loadSongs();
    selectSongOne();
    useMaxSong();
    submitVote(arenaHandler);
  });

  it('approves song and votes for a song', function () {
    cy.registerAbiHandler(SONG_ADDRESS[SupportedChainId.GOERLI], SongAbiHandler);
    const arenaHandler = this.metamocks!.registerAbiHandler<Arena>(
      ARENA_ADDRESS[SupportedChainId.GOERLI],
      ArenaHandler,
    );

    cy.spy(arenaHandler, 'vote');
    loadSongs();
    selectSongOne();
    useMaxSong();
    approveSong();
    submitVote(arenaHandler);
  });
});
