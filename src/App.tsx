import { Fragment } from 'react'
import { RandomDeckSelector } from './components/random-deck-selector'
import { DecklistContextProvider } from './context/decklist-context'
import { GameContextProvider } from './context/game-context'

export function App() {
  return (
    <Fragment>
      <DecklistContextProvider>
        <GameContextProvider>
          <RandomDeckSelector />
        </GameContextProvider>
      </DecklistContextProvider>
    </Fragment>
  )
}
