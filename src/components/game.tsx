import { useState } from 'react'
import { useGameContext } from '../context/game-context'
import { useGameBoardRotation } from '../hooks/use-game-board-rotation'
import { GameBoard, PlayerWrapper } from './game-layout'
import { PlayerBoard } from './player-board'
import { Settings } from './settings'

export function Game() {
  const { getPlayerRotation } = useGameBoardRotation()
  const { players } = useGameContext()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <GameBoard numOfPlayers={players.length} onClickSettingsButton={() => setSettingsOpen(true)}>
      {settingsOpen && (
        <Settings settingsOpen={settingsOpen} onClickCurtain={() => setSettingsOpen(false)} />
      )}
      {players.map((player, index) => (
        <PlayerWrapper numOfPlayers={players.length} playerId={index + 1} key={index}>
          <PlayerBoard
            {...player}
            playerId={index + 1}
            layoutRotation={getPlayerRotation(index + 1, players.length)}
          />
        </PlayerWrapper>
      ))}
    </GameBoard>
  )
}
