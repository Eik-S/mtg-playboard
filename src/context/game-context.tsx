import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Player } from '../components/player-board'
import { useColors } from '../hooks/use-colors'
import { useDecklistContext } from './decklist-context'

type GameMode = 'jumpstart'

interface GameApi {
  players: Player[]
  startingLife: number
  numberOfPlayers: number
  numberOfRandomDecks: number
  startNewGame: () => void
  setNumberOfPlayers: Dispatch<SetStateAction<number>>
  setNumberOfRandomDecks: Dispatch<SetStateAction<number>>
}

function useGameState() {
  const [gameMode] = useState<GameMode>('jumpstart')
  const [startingLife] = useState(20)
  const [numberOfPlayers, setNumberOfPlayers] = useState(2)
  const [players, setPlayers] = useState<Player[]>([])
  const [numberOfRandomDecks, setNumberOfRandomDecks] = useState(2)
  const { generateRandomDecks } = useDecklistContext()
  const { getRandomColor } = useColors()

  useEffect(() => {
    function initPlayers(numberOfPlayers: number): Player[] {
      const p = []
      for (let i = 0; i < numberOfPlayers; i++) {
        p.push({
          color: getRandomColor(),
          randomDecks: [],
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
  }, [getRandomColor, numberOfPlayers])

  function handleStartNewGame() {
    if (gameMode === 'jumpstart') {
      const randomDecks = generateRandomDecks(numberOfPlayers, numberOfRandomDecks)
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player, index) => ({ ...player, randomDecks: randomDecks[index] }))
      })
    }
  }

  return {
    players,
    startingLife,
    numberOfPlayers,
    numberOfRandomDecks,
    startNewGame: handleStartNewGame,
    setNumberOfPlayers,
    setNumberOfRandomDecks,
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
