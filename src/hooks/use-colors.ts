import { useState } from 'react'

const colorPalette: string[] = [
  '#fa744f',
  '#ffbcbc',
  '#4cd3c2',
  '#b7efcd',
  '#edffea',
  '#ffe75e',
  '#feb72b',
  '#e85f99',
  '#9399ff',
  '#dab8f3',
  '#ea7ad7',
  '#ce0f3d',
  '#fd2eb3',
  '#ffc6c7',
]

export function useColors() {
  let availableColors = [...colorPalette]

  function getRandomColor(): string {
    if (availableColors.length === 0) {
      throw new Error('No more colors available')
    }

    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)]
    availableColors = availableColors.filter((color) => color !== randomColor)
    return randomColor
  }

  return {
    getRandomColor,
  }
}
