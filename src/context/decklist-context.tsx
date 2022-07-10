import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { jumpstartDecks } from '../data/jumpstart-decks'
import { useLocalStorage } from '../hooks/use-local-storage'

type Mana = 'plains' | 'swamp' | 'mountain' | 'forest' | 'island' | 'multi'
type Rarity = 'common' | 'rare' | 'mythic'
export type WordType = 'adjective' | 'prenoun' | 'noun' | 'suffix'
export interface Deck {
  name: string
  mana: Mana
  rarity: Rarity
  wordType: WordType
}

interface DecklistApi {
  collectedDecks: Deck[]
  availableDecks: Deck[]
  addDeck: (deck: Deck) => void
  removeDeck: (deck: Deck) => void
  selectAllDecks: () => void
  removeAllDecks: () => void
  generateRandomDecks: (numberOfPlayers: number, numberOfDecks: number) => Deck[][]
}

function useDecklist() {
  const availableDecks = jumpstartDecks
  const [collectedDecks, setCollectedDecks] = useState<Deck[]>(availableDecks)
  const { getLocalStorage, setLocalStorage } = useLocalStorage()

  useEffect(() => {
    const storedCollectedDecks = getLocalStorage<Deck[]>('collectedDecks')
    if (storedCollectedDecks) {
      const storedDeckNames = storedCollectedDecks.map((deck) => deck.name)
      const upToDateDecks = jumpstartDecks.filter((deck) => storedDeckNames.includes(deck.name))
      setCollectedDecks(upToDateDecks)
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

  function generateRandomDecks(numberOfPlayers: number, numberOfDecks: number): Deck[][] {
    const randomDecks: Deck[][] = []
    const unavailableDecks: Deck[] = []
    for (let i = 0; i < numberOfPlayers; i++) {
      let selectedDecks: Deck[] = []
      while (selectedDecks.length < numberOfDecks) {
        const randomDeckIndex = Math.floor(Math.random() * collectedDecks.length)
        const randomDeck = collectedDecks[randomDeckIndex]
        if (selectedDecks.length === 1 && randomDeck.mana === selectedDecks[0].mana) continue
        if (!unavailableDecks.includes(randomDeck)) {
          selectedDecks.push(randomDeck)
          unavailableDecks.push(randomDeck)
        }
      }
      randomDecks.push(selectedDecks)
    }
    return randomDecks
  }

  return {
    collectedDecks,
    availableDecks,
    addDeck,
    removeDeck,
    selectAllDecks,
    removeAllDecks,
    generateRandomDecks,
  }
}

const DecklistContext = createContext<DecklistApi | undefined>(undefined)

export function DecklistContextProvider({ children }: { children: ReactNode }) {
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
