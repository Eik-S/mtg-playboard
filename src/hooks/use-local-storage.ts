import { useCallback } from 'react'

export function useLocalStorage() {
  function setLocalStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  function getLocalStorage<T>(key: string): T | undefined {
    const item = localStorage.getItem(key)
    if (item === null) {
      return undefined
    }
    return JSON.parse(item) as T
  }

  return {
    setLocalStorage,
    getLocalStorage: useCallback(getLocalStorage, []),
  }
}
