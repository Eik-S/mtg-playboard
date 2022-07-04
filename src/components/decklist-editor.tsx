import { css } from '@emotion/react'
import { useDecklistContext } from '../context/decklist-context'

interface DecklistEditorProps {
  onCloseDecklistEditor: () => void
}

export function DecklistEditor({ onCloseDecklistEditor }: DecklistEditorProps) {
  const { availableDecks, collectedDecks, addDeck, removeDeck, selectAllDecks, removeAllDecks } =
    useDecklistContext()
  const collectedDeckNames = collectedDecks.map((deck) => deck.name)

  return (
    <div css={styles.decklistEditorWrapper}>
      <div css={styles.curtain} onClick={() => onCloseDecklistEditor()} />
      <div css={styles.deckSelectionPane}>
        <ul css={styles.deckList}>
          <li css={styles.deckListItem}>
            <span css={styles.editionName}>JUMPSTART</span>
            {availableDecks.length === collectedDecks.length ? (
              <button css={styles.checkboxButton} onClick={() => removeAllDecks()}>
                X
              </button>
            ) : (
              <button css={styles.checkboxButton} onClick={() => selectAllDecks()}></button>
            )}
          </li>
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
    </div>
  )
}

const styles = {
  decklistEditorWrapper: css`
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr auto 1fr;
  `,
  curtain: css`
    grid-column: 1 / span 3;
    grid-row: 1 / span 3;
  `,
  deckSelectionPane: css`
    grid-column: 2;
    grid-row: 2;
    width: 600px;
    max-height: 600px;
    overflow-y: scroll;
    border: 10px solid black;
    border-radius: 12px;
    padding: 24px;
  `,
  deckList: css`
    width: max-content;
    display: flex;
    flex-direction: column;
    row-gap: 6px;
  `,
  deckListItem: css`
    display: flex;
    flex-direction: row;
    column-gap: 24px;
    justify-content: right;
  `,
  editionName: css`
    font-size: 24px;
    text-decoration: underline;
    margin-bottom: 24px;
  `,
  deckName: css`
    font-size: 24px;
  `,
  checkboxButton: css`
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
