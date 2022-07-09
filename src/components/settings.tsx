import { Fragment, useState } from 'react'
import { Deck, useDecklistContext } from '../context/decklist-context'
import { DecklistEditor } from './decklist-editor'

interface SettingsProps {
  numberOfPlayers: number
  onSelectedRandomDecks: (randomDecks: Deck[][]) => void
}

export function Settings({ numberOfPlayers, onSelectedRandomDecks }: SettingsProps) {
  const [isDecklistEditorOpen, setIsDecklistEditorOpen] = useState(false)

  const { collectedDecks } = useDecklistContext()

  function generateRandomDecks() {
    const randomDecks: Deck[][] = []
    const unavailableDecks: Deck[] = []
    for (let i = 0; i < numberOfPlayers; i++) {
      let selectedDecks: Deck[] = []
      while (selectedDecks.length < 2) {
        const randomDeckIndex = Math.floor(Math.random() * collectedDecks.length)
        const randomDeck = collectedDecks[randomDeckIndex]
        if (selectedDecks.length === 1 && randomDeck.mana === selectedDecks[0].mana) continue
        if (!unavailableDecks.includes(randomDeck)) {
          selectedDecks.push(randomDeck)
          unavailableDecks.push(randomDeck)
        }
      }
      randomDecks.push(selectedDecks)
    }

    onSelectedRandomDecks(randomDecks)
  }

  return (
    <Fragment>
      <button onClick={() => generateRandomDecks()}>New Game</button>
      <button onClick={() => setIsDecklistEditorOpen(true)}>Edit Decks</button>
      {isDecklistEditorOpen && (
        <DecklistEditor onCloseDecklistEditor={() => setIsDecklistEditorOpen(false)} />
      )}
    </Fragment>
  )
}
