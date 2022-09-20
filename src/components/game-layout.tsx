import { css } from '@emotion/react'
import { Fragment, ReactNode } from 'react'
import { useGameContext } from '../context/game-context'

interface GameBoardProps {
  numOfPlayers: number
  children: ReactNode
  onClickSettingsButton: () => void
}

export function GameBoard({ numOfPlayers, children, onClickSettingsButton }: GameBoardProps) {
  return (
    <div css={styles.gameBoard(numOfPlayers)}>
      {children}
      <div css={styles.midPanelButtons(numOfPlayers)}>
        <GameBoardButtons onClickSettingsButton={onClickSettingsButton} />
      </div>
    </div>
  )
}

interface GameBoardButtonsProps {
  onClickSettingsButton: () => void
}

function GameBoardButtons({ onClickSettingsButton }: GameBoardButtonsProps) {
  const { startNewGame } = useGameContext()

  return (
    <Fragment>
      <button onClick={() => startNewGame()}>New Game</button>
      <button onClick={() => onClickSettingsButton()}>Settings</button>
    </Fragment>
  )
}

interface PlayerWrapperProps {
  playerId: number
  numOfPlayers: number
  children: ReactNode
}

export function PlayerWrapper({ playerId, numOfPlayers, children }: PlayerWrapperProps) {
  return (
    <div className={`player-${playerId}-wrapper`}>
      <div
        css={styles.rotatedInnerWrapper(numOfPlayers, playerId)}
        className="rotated-inner-wrapper"
      >
        {children}
      </div>
    </div>
  )
}

const styles = {
  gameBoard: (numberOfPlayers: number) => css`
    height: 100vh;

    @supports (height: 100dvh) {
      height: 100dvh;
    }

    display: grid;

    ${numberOfPlayers === 4 &&
    css`
      @media (orientation: landscape) {
        grid-template-columns: 1fr 2fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-template-areas:
          'player_4 player_1 player_2'
          'player_4 player_3 player_2';
      }
      @media (orientation: portrait) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 2fr 1fr;
        grid-template-areas:
          'player_1 player_1'
          'player_4 player_2'
          'player_3 player_3';
      }
    `}
    ${numberOfPlayers === 3 &&
    css`
      @media (orientation: landscape) {
        grid-template-columns: 35vw 65vw;
        grid-template-rows: 1fr 1fr;
        grid-template-areas:
          'player_3 player_1'
          'player_3 player_2';
      }
      @media (orientation: portrait) {
        grid-template-rows: 35vh 65vh;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
          'player_1 player_1'
          'player_3 player_2';
      }
    `}
    ${numberOfPlayers === 2 &&
    css`
      @media (orientation: landscape) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        grid-template-areas: 'player_1 player_2';
      }
      @media (orientation: portrait) {
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr;
        grid-template-areas:
          'player_1'
          'player_2';
      }
    `}

    .player-1-wrapper {
      grid-area: player_1;
    }
    .player-2-wrapper {
      grid-area: player_2;
    }
    .player-3-wrapper {
      grid-area: player_3;
    }
    .player-4-wrapper {
      grid-area: player_4;
    }

    .player-1-wrapper,
    .player-2-wrapper,
    .player-3-wrapper,
    .player-4-wrapper {
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
  rotatedInnerWrapper: (numberOfPlayers: number, playerId: number) => css`
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    ${numberOfPlayers === 2 &&
    css`
      @media (orientation: portrait) {
        ${playerId === 1 &&
        css`
          transform: rotate(180deg);
        `}
      }
      @media (orientation: landscape) {
        width: 100vh;
        height: 50vw;
        ${playerId === 1 &&
        css`
          transform: rotate(90deg);
        `}
        ${playerId === 2 &&
        css`
          transform: rotate(-90deg);
        `};
      }
    `}

    ${numberOfPlayers === 3 &&
    css`
      @media (orientation: portrait) {
        ${playerId === 1 &&
        css`
          transform: rotate(180deg);
        `}
        ${playerId === 2 &&
        css`
          transform: rotate(-90deg);
        `}
        ${playerId === 3 &&
        css`
          transform: rotate(90deg);
        `}
        ${(playerId === 2 || playerId === 3) &&
        css`
          width: 65vh;
          height: 50vw;
        `}
      }
      @media (orientation: landscape) {
        ${playerId === 1 &&
        css`
          transform: rotate(180deg);
        `}
        ${playerId === 3 &&
        css`
          transform: rotate(90deg);
          width: 100vh;
          height: 35vw;
        `};
      }
    `}
    ${numberOfPlayers === 4 &&
    css`
      @media (orientation: portrait) {
        ${playerId === 1 &&
        css`
          transform: rotate(180deg);
        `}
        ${playerId === 2 &&
        css`
          transform: rotate(-90deg);
          width: 50vh;
          height: 50vw;
        `}
        ${playerId === 4 &&
        css`
          transform: rotate(90deg);
          width: 50vh;
          height: 50vw;
        `}
      }
      @media (orientation: landscape) {
        ${playerId === 1 &&
        css`
          transform: rotate(180deg);
        `}
        ${playerId === 2 &&
        css`
          transform: rotate(-90deg);
          width: 100vh;
          height: 25vw;
        `};
        ${playerId === 4 &&
        css`
          transform: rotate(90deg);
          width: 100vh;
          height: 25vw;
        `};
      }
    `}
  `,
  midPanelButtons: (numberOfPlayers: number) => css`
    grid-column: 1 / span 4;
    grid-row: 1 / span 4;
    justify-self: center;
    align-self: center;
    z-index: 1;

    ${numberOfPlayers === 3 &&
    css`
      @media (orientation: landscape) {
        grid-column: 2;
      }
      @media (orientation: portrait) {
        grid-row: 2;
      }
    `}

    ${numberOfPlayers === 2 &&
    css`
      @media (orientation: landscape) {
        transform: rotate(90deg);
      }
    `}

    ${numberOfPlayers >= 3 &&
    css`
      @media (orientation: portrait) {
        transform: rotate(90deg);
      }
    `}
  `,
}
