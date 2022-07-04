import { createContext, useContext, useEffect, useState } from 'react'
import { jumpstartDecks } from '../data/jumpstart-decks'
import { useLocalStorage } from '../hooks/use-local-storage'

type Mana = 'plains' | 'swamp' | 'mountain' | 'forest' | 'island' | 'multi'
type Rarity = 'common' | 'rare' | 'mythic'

export interface Deck {
  name: string
  mana: Mana
  rarity: Rarity
}

interface DecklistApi {
  collectedDecks: Deck[]
  availableDecks: Deck[]
  addDeck: (deck: Deck) => void
  removeDeck: (deck: Deck) => void
  selectAllDecks: () => void
  removeAllDecks: () => void
}

function useDecklist() {
  const [collectedDecks, setCollectedDecks] = useState<Deck[]>([])
  const { getLocalStorage, setLocalStorage } = useLocalStorage()
  const availableDecks = jumpstartDecks

  useEffect(() => {
    const storedCollectedDecks = getLocalStorage<Deck[]>('collectedDecks')
    if (storedCollectedDecks) {
      setCollectedDecks(storedCollectedDecks)
    }
  }, [getLocalStorage])

  function addDeck(deck: Deck) {
    setCollectedDecks((prevCollectedDecks) => {
      const newCollectedDecks = [...prevCollectedDecks, deck]
      setLocalStorage('collectedDecks', newCollectedDecks)
      return newCollectedDecks
    })
  }

  function removeDeck(deck: Deck) {
    setCollectedDecks((prevCollectedDecks) => {
      const newCollectedDecks = prevCollectedDecks.filter((prevDeck) => prevDeck.name !== deck.name)
      setLocalStorage('collectedDecks', newCollectedDecks)
      return newCollectedDecks
    })
  }

  function selectAllDecks() {
    setCollectedDecks(availableDecks)
    setLocalStorage('collectedDecks', availableDecks)
  }

  function removeAllDecks() {
    setCollectedDecks([])
    setLocalStorage('collectedDecks', [])
  }

  return {
    collectedDecks,
    availableDecks,
    addDeck,
    removeDeck,
    selectAllDecks,
    removeAllDecks,
  }
}

const DecklistContext = createContext<DecklistApi | undefined>(undefined)

export function DecklistContextProvider({ children }: { children: React.ReactNode }) {
  const decklist = useDecklist()

  return <DecklistContext.Provider value={decklist}>{children}</DecklistContext.Provider>
}

export function useDecklistContext() {
  const context = useContext(DecklistContext)

  if (context === undefined) {
    throw new Error('useDecklistContext must be used within a DecklistContextProvider')
  }

  return context
}
