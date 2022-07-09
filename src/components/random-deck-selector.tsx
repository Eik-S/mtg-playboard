import { useState } from 'react'
import { Deck } from '../context/decklist-context'
import { useColors } from '../hooks/use-colors'
import { GameBoard, PlayerWrapper } from './game-layout'
import { Player, PlayerBoard } from './player-board'
import { Settings } from './settings'

export function RandomDeckSelector() {
  const { getRandomColor } = useColors()

  const [players, setPlayers] = useState<Player[]>([
    { color: getRandomColor(), randomDecks: [] },
    { color: getRandomColor(), randomDecks: [] },
    { color: getRandomColor(), randomDecks: [] },
    { color: getRandomColor(), randomDecks: [] },
  ])

  function handleSelectedRandomDecks(randomDecks: Deck[][]) {
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player, index) => ({ ...player, randomDecks: randomDecks[index] }))
    })
  }

  const settings = (
    <Settings numberOfPlayers={players.length} onSelectedRandomDecks={handleSelectedRandomDecks} />
  )

  return (
    <GameBoard numOfPlayers={players.length} settings={settings}>
      {players.map((player, id) => (
        <PlayerWrapper numOfPlayers={players.length} playerId={id} key={id}>
          <PlayerBoard {...player} />
        </PlayerWrapper>
      ))}
    </GameBoard>
  )
}
