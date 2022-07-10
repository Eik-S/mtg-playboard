import { css } from '@emotion/react'
import { useDecklistContext } from '../context/decklist-context'

export function DecklistEditor({ ...props }) {
  const { availableDecks, collectedDecks, addDeck, removeDeck, selectAllDecks, removeAllDecks } =
    useDecklistContext()
  const collectedDeckNames = collectedDecks.map((deck) => deck.name)

  return (
    <div>
      <div>
        <span css={styles.editionName}>JUMPSTART</span>
        {availableDecks.length === collectedDecks.length ? (
          <button css={styles.checkboxButton} onClick={() => removeAllDecks()}>
            X
          </button>
        ) : (
          <button css={styles.checkboxButton} onClick={() => selectAllDecks()}></button>
        )}
      </div>
      <ul css={styles.deckList}>
        {availableDecks.map((deck) => (
          <li css={styles.deckListItem} key={deck.name}>
            <span css={styles.deckName}>{deck.name}</span>
            {collectedDeckNames.includes(deck.name) ? (
              <button css={styles.checkboxButton} onClick={() => removeDeck(deck)}>
                X
              </button>
            ) : (
              <button css={styles.checkboxButton} onClick={() => addDeck(deck)}></button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const styles = {
  deckList: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    row-gap: 6px;
    column-gap: 32px;
  `,
  deckListItem: css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
  editionName: css`
    font-size: 24px;
    text-decoration: underline;
    margin-bottom: 24px;
  `,
  deckName: css`
    font-size: 24px;
    align-self: center;
  `,
  checkboxButton: css`
    flex-shrink: 0;
    align-self: center;
    width: 38px;
    height: 38px;
    border: 6px solid black;
    border-radius: 12px;
    background-color: transparent;
    font-size: 24px;
    font-weight: 900;
    line-height: 24px;
    padding: 0;
  `,
}
