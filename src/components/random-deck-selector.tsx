import { useState } from 'react'
import { useGameContext } from '../context/game-context'
import { useGameBoardRotation } from '../hooks/use-game-board-rotation'
import { GameBoard, PlayerWrapper } from './game-layout'
import { PlayerBoard } from './player-board'
import { Settings } from './settings'

export function RandomDeckSelector() {
  const { getPlayerRotation } = useGameBoardRotation()
  const { players } = useGameContext()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <GameBoard numOfPlayers={players.length} onClickSettingsButton={() => setSettingsOpen(true)}>
      {settingsOpen && (
        <Settings settingsOpen={settingsOpen} onClickCurtain={() => setSettingsOpen(false)} />
      )}
      {players.map((player, id) => (
        <PlayerWrapper numOfPlayers={players.length} playerId={id} key={id}>
          <PlayerBoard {...player} layoutRotation={getPlayerRotation(id + 1, players.length)} />
        </PlayerWrapper>
      ))}
    </GameBoard>
  )
}
