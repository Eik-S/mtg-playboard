import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { start } from 'repl'
import { Player } from '../components/player-board'
import { useColors } from '../hooks/use-colors'
import { useDecklistContext } from './decklist-context'

type GameMode = 'jumpstart' | 'normal' | 'commander'

interface GameApi {
  players: Player[]
  startingLife: number
  numberOfPlayers: number
  numberOfRandomDecks: number
  gameMode: GameMode
  startNewGame: () => void
  setNumberOfPlayers: Dispatch<SetStateAction<number>>
  setNumberOfRandomDecks: Dispatch<SetStateAction<number>>
  updateLifePoints: (playerIndex: number, lifePoints: number) => void
  setStartingLife: Dispatch<SetStateAction<number>>
  setGameMode: Dispatch<SetStateAction<GameMode>>
}

function useGameState() {
  const [gameMode, setGameMode] = useState<GameMode>('jumpstart')
  const [startingLife, setStartingLife] = useState(20)
  const [numberOfPlayers, setNumberOfPlayers] = useState(2)
  const [players, setPlayers] = useState<Player[]>([])
  const [numberOfRandomDecks, setNumberOfRandomDecks] = useState(2)
  const { generateRandomDecks } = useDecklistContext()
  const { getRandomColor } = useColors()

  // initialization
  useEffect(() => {
    function initPlayers(numberOfPlayers: number): Player[] {
      const p = []
      for (let i = 0; i < numberOfPlayers; i++) {
        p.push({
          color: getRandomColor(),
          randomDecks: [],
          lifePoints: startingLife,
        })
      }
      return p
    }

    setPlayers((prevPlayers) => {
      if (prevPlayers.length < numberOfPlayers) {
        const difference = numberOfPlayers - prevPlayers.length
        return [...prevPlayers, ...initPlayers(difference)]
      }
      if (prevPlayers.length > numberOfPlayers) {
        const offset = numberOfPlayers - prevPlayers.length
        return prevPlayers.slice(0, offset)
      }
      return prevPlayers
    })
  }, [getRandomColor, numberOfPlayers, startingLife])

  // gameMode specific resets on game mode change
  useEffect(() => {
    const commanderStartingLife = 40
    const normalStartingLife = 20

    if (gameMode !== 'jumpstart') {
      setStartingLife(normalStartingLife)
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => ({
          ...player,
          randomDecks: [],
          lifePoints: normalStartingLife,
        })),
      )
    }

    if (gameMode === 'commander') {
      setStartingLife(commanderStartingLife)
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => ({
          ...player,
          randomDecks: [],
          lifePoints: commanderStartingLife,
        })),
      )
    }

    if (gameMode === 'normal') {
      setStartingLife(normalStartingLife)
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => ({
          ...player,
          randomDecks: [],
          lifePoints: normalStartingLife,
        })),
      )
    }
  }, [gameMode])

  function handleStartNewGame() {
    if (gameMode === 'jumpstart') {
      const randomDecks = generateRandomDecks(numberOfPlayers, numberOfRandomDecks)
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player, index) => ({
          ...player,
          randomDecks: randomDecks[index],
        }))
      })
    }
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({ ...player, lifePoints: startingLife })),
    )
  }

  function updateLifePoints(playerId: number, lifePoints: number) {
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers]
      newPlayers[playerId - 1].lifePoints = lifePoints
      return newPlayers
    })
  }

  return {
    players,
    startingLife,
    numberOfPlayers,
    numberOfRandomDecks,
    gameMode,
    startNewGame: handleStartNewGame,
    setNumberOfPlayers,
    setNumberOfRandomDecks,
    updateLifePoints,
    setStartingLife,
    setGameMode,
  }
}

const GameContext = createContext<GameApi | undefined>(undefined)

export function GameContextProvider({ children }: { children: ReactNode }) {
  const game = useGameState()

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

export function useGameContext() {
  const context = useContext(GameContext)

  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameContextProvider')
  }

  return context
}
