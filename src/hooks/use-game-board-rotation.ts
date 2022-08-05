import { useCallback, useEffect, useState } from 'react'

export function useGameBoardRotation() {
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | undefined>(undefined)

  useEffect(() => {
    const portrait = window.matchMedia('(orientation: portrait)')
    setOrientation(portrait.matches ? 'portrait' : 'landscape')
    portrait.addEventListener('change', function (e) {
      if (e.matches) {
        setOrientation('portrait')
      } else {
        setOrientation('landscape')
      }
    })
  }, [])

  function getPlayerRotation(playerId: number, numOfPlayers: number): number {
    if (numOfPlayers === 2) {
      if (orientation === 'portrait') {
        switch (playerId) {
          case 1:
            return 180
          default:
            return 0
        }
      } else {
        switch (playerId) {
          case 1:
            return -90
          default:
            return 90
        }
      }
    }
    if (numOfPlayers === 3) {
      if (orientation === 'landscape') {
        switch (playerId) {
          case 1:
            return 180
          case 3:
            return -90
          default:
            return 0
        }
      } else {
        switch (playerId) {
          case 1:
            return 180
          case 2:
            return 90
          case 3:
            return -90
          default:
            return 0
        }
      }
    }
    if (numOfPlayers === 4) {
      switch (playerId) {
        case 1:
          return 180
        case 2:
          return 90
        case 4:
          return -90
        default:
          return 0
      }
    }
    throw new Error('unreachable case')
  }

  return {
    getPlayerRotation: useCallback(getPlayerRotation, [orientation]),
  }
}
