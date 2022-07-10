import { Fragment } from 'react'
import { Game } from './components/game'
import { DecklistContextProvider } from './context/decklist-context'
import { GameContextProvider } from './context/game-context'

export function App() {
  return (
    <Fragment>
      <DecklistContextProvider>
        <GameContextProvider>
          <Game />
        </GameContextProvider>
      </DecklistContextProvider>
    </Fragment>
  )
}
