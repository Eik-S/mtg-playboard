import { css } from '@emotion/react'
import { Fragment, useState } from 'react'
import { Deck, useDecklistContext } from '../context/decklist-context'
import { DecklistEditor } from './decklist-editor'

interface Player {
  randomDecks: Deck[]
  name: string
}

export function RandomDeckSelector() {
  const [isDecklistEditorOpen, setIsDecklistEditorOpen] = useState(false)
  const [players, setPlayers] = useState<Player[]>([
    { name: 'Sörski', randomDecks: [] },
    { name: 'Eiksen', randomDecks: [] },
    { name: 'Mellskin', randomDecks: [] },
  ])

  const { collectedDecks } = useDecklistContext()

  function showRandomDecks() {
    const alreadyChosenDecks: Deck[] = []
    players.forEach((player, index) => {
      let selectionsMade = 0
      let selectedDecks: Deck[] = []
      while (selectionsMade < 2) {
        const randomDeckIndex = Math.floor(Math.random() * collectedDecks.length)
        const randomDeck = collectedDecks[randomDeckIndex]
        if (selectedDecks.length === 1 && randomDeck.mana === selectedDecks[0].mana) continue
        if (!alreadyChosenDecks.includes(randomDeck)) {
          selectedDecks.push(randomDeck)
          alreadyChosenDecks.push(randomDeck)
          selectionsMade++
        }
      }
      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers]
        newPlayers[index].randomDecks = selectedDecks
        return newPlayers
      })
    })
  }

  return (
    <Fragment>
      <button onClick={() => showRandomDecks()}>New Game</button>
      <button onClick={() => setIsDecklistEditorOpen(true)}>Edit Decks</button>
      {isDecklistEditorOpen && (
        <DecklistEditor onCloseDecklistEditor={() => setIsDecklistEditorOpen(false)} />
      )}
      {players.map((player) => (
        <div>
          <span css={styles.playerName}>{player.name}</span>

          {player.randomDecks.map((randomDeck) => (
            <div>
              <ul>
                <li css={styles.deckName} key={randomDeck.name}>
                  {randomDeck.name}
                </li>
              </ul>
            </div>
          ))}
        </div>
      ))}
    </Fragment>
  )
}

const styles = {
  playerName: css`
    display: block;
    margin-top: 40px;
    font-size: 36px;
    text-transform: uppercase;
  `,
  deckName: css`
    font-size: 24px;
  `,
}
