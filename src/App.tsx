import { Fragment } from 'react'
import { RandomDeckSelector } from './components/random-deck-selector'
import { DecklistContextProvider } from './context/decklist-context'

export function App() {
  return (
    <Fragment>
      <DecklistContextProvider>
        <RandomDeckSelector />
      </DecklistContextProvider>
    </Fragment>
  )
}
