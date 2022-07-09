import { useState } from 'react'
import { Deck } from '../context/decklist-context'
import { useColors } from '../hooks/use-colors'
import { useGameBoardRotation } from '../hooks/use-game-board-rotation'
import { GameBoard, PlayerWrapper } from './game-layout'
import { Player, PlayerBoard } from './player-board'
import { Settings } from './settings'

export function RandomDeckSelector() {
  const { getRandomColor } = useColors()
  const { getPlayerRotation } = useGameBoardRotation()

  const [players, setPlayers] = useState<Player[]>([
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
          <PlayerBoard {...player} layoutRotation={getPlayerRotation(id + 1, players.length)} />
        </PlayerWrapper>
      ))}
    </GameBoard>
  )
}
