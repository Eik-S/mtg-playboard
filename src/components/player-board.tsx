import { css } from '@emotion/react'
import { TouchEvent, useEffect, useState } from 'react'
import { Deck, WordType } from '../context/decklist-context'
import { useGameContext } from '../context/game-context'

export interface Player {
  randomDecks: Deck[]
  color: string
  lifePoints: number
}

export interface PlayerBoardProps extends Player {
  playerId: number
  layoutRotation: number
}

export function PlayerBoard({
  playerId,
  color,
  randomDecks,
  lifePoints,
  layoutRotation,
  ...props
}: PlayerBoardProps) {
  const { updateLifePoints } = useGameContext()
  const [deckName, setDeckName] = useState('')
  const [touchStartPoint, setTouchStartPoint] = useState<{ x: number; y: number } | undefined>(
    undefined,
  )
  const [touchMoveLifePoints, setTouchMoveLifePoints] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (randomDecks === []) return
    const sortedDeckNames = randomDecks
      .sort((a: Deck, b: Deck) => {
        const wordTypeOrder: Record<WordType, number> = {
          adjective: 0,
          prenoun: 1,
          noun: 2,
          suffix: 3,
        }
        return wordTypeOrder[a.wordType] - wordTypeOrder[b.wordType]
      })
      .map((deck) => deck.name)

    setDeckName(sortedDeckNames.join(' '))
  }, [randomDecks])

  function handleTouchStart(event: TouchEvent | undefined) {
    if (event === undefined) return
    setTouchStartPoint({ x: event.touches[0].pageX, y: event.touches[0].pageY })
  }

  function handleTouchMove(event: TouchEvent | undefined) {
    if (event === undefined || touchStartPoint === undefined) return
    const offsetX = (() => {
      switch (layoutRotation) {
        case 180:
          return touchStartPoint.x - event.touches[0].pageX
        case 90:
          return touchStartPoint.y - event.touches[0].pageY
        case -90:
          return -(touchStartPoint.y - event.touches[0].pageY)
        default:
          return -(touchStartPoint.x - event.touches[0].pageX)
      }
    })()
    const offsetY = (() => {
      switch (layoutRotation) {
        case 180:
          return -(touchStartPoint.y - event.touches[0].pageY)
        case 90:
          return touchStartPoint.x - event.touches[0].pageX
        case -90:
          return -(touchStartPoint.x - event.touches[0].pageX)
        default:
          return touchStartPoint.y - event.touches[0].pageY
      }
    })()

    setTouchMoveLifePoints(Math.floor((offsetX + offsetY) / 20))
  }

  function setLifePoints(newValue: number) {
    updateLifePoints(playerId, newValue)
  }

  function handleTouchEnd() {
    setTouchStartPoint(undefined)
    if (touchMoveLifePoints !== undefined) {
      setLifePoints(lifePoints + touchMoveLifePoints)
      setTouchMoveLifePoints(undefined)
    }
  }

  return (
    <div css={styles.board(color)} {...props}>
      <h2 css={styles.deckName}>{deckName}</h2>
      <div
        css={styles.lifePointsPanel}
        onTouchStart={(event) => handleTouchStart(event)}
        onTouchMove={(event) => handleTouchMove(event)}
        onTouchEnd={() => handleTouchEnd()}
      >
        <button
          css={css([styles.decreaseButton, styles.invisibleButton])}
          onClick={() => setLifePoints(lifePoints - 1)}
        ></button>
        <div css={styles.lifePointsDisplay}>
          {touchMoveLifePoints !== undefined && (
            <div css={styles.lifePointsTemp}>
              {touchMoveLifePoints > 0 && '+'}
              {touchMoveLifePoints}
            </div>
          )}
          <div css={styles.lifePoints}>{lifePoints}</div>
        </div>
        <button
          css={css([styles.increaseButton, styles.invisibleButton])}
          onClick={() => setLifePoints(lifePoints + 1)}
        ></button>
      </div>
    </div>
  )
}

const styles = {
  board: (color: string) => css`
    background-color: ${color};
    width: 100%;
    height: 100%;
    border: 10px solid rgba(255, 255, 255, 0.7);
    box-sizing: border-box;
    display: grid;
    grid-template-rows: 80px 1fr;
    justify-items: center;
  `,
  deckName: css`
    font-size: 32px;
    text-align: center;
  `,
  lifePointsPanel: css`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
  `,
  decreaseButton: css`
    grid-column: 1;
  `,
  increaseButton: css`
    grid-column: 3;
  `,
  invisibleButton: css`
    background-color: transparent;
    border: none;
  `,
  lifePointsDisplay: css`
    grid-column: 2;
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    grid-template-columns: 1fr;
    justify-items: center;
  `,
  lifePoints: css`
    grid-row: 2;
    font-size: 4em;
  `,
  lifePointsTemp: css`
    grid-row: 1;
    font-size: 2em;
    align-self: end;
  `,
}
