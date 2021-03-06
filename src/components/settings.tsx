import { css } from '@emotion/react'
import { Fragment, useEffect, useState } from 'react'
import { useGameContext } from '../context/game-context'
import { DecklistEditor } from './decklist-editor'

interface SettingsProps {
  settingsOpen: boolean
  onClickCurtain: () => void
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function Settings({ settingsOpen, onClickCurtain }: SettingsProps) {
  const [installableEvent, setInstallableEvent] = useState<BeforeInstallPromptEvent | undefined>(
    undefined,
  )

  const {
    numberOfPlayers,
    numberOfRandomDecks,
    startingLife,
    gameMode,
    setNumberOfPlayers,
    setNumberOfRandomDecks,
    setStartingLife,
    setGameMode,
  } = useGameContext()

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setInstallableEvent(e)
    })
  }, [])

  function handleClickInstall() {
    if (installableEvent === undefined) return

    installableEvent.prompt()

    installableEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA prompt')
        setInstallableEvent(undefined)
      } else {
        console.log('User dismissed the PWA prompt')
      }
    })
  }

  return (
    <Fragment>
      {settingsOpen && (
        <div css={styles.settingsPaneWrapper}>
          <div css={styles.curtain} onClick={() => onClickCurtain()} />
          <div css={styles.settingsPane}>
            {installableEvent && (
              <button onClick={() => handleClickInstall()}>Install on your device</button>
            )}
            <div css={styles.ruler}>Game Mode</div>
            <div css={styles.gameModeButtons}>
              <button
                className={gameMode !== 'normal' ? 'unchecked' : ''}
                onClick={() => setGameMode('normal')}
              >
                normal
              </button>
              <button
                className={gameMode !== 'commander' ? 'unchecked' : ''}
                onClick={() => setGameMode('commander')}
              >
                commander
              </button>
              <button
                className={gameMode !== 'jumpstart' ? 'unchecked' : ''}
                onClick={() => setGameMode('jumpstart')}
              >
                jumpstart
              </button>
            </div>
            <div css={styles.ruler}>Game Settings</div>
            <div css={styles.section}>
              <div css={styles.plusMinus}>
                <label>Number of Players</label>
                <button
                  onClick={() => setNumberOfPlayers((prev) => prev - 1)}
                  disabled={numberOfPlayers === 2}
                >
                  -
                </button>
                <span>{numberOfPlayers}</span>
                <button
                  onClick={() => setNumberOfPlayers((prev) => prev + 1)}
                  disabled={numberOfPlayers === 4}
                >
                  +
                </button>
              </div>
              <div css={styles.plusMinus}>
                <label>Starting Life</label>
                <button
                  onClick={() => setStartingLife((prev) => prev - 10)}
                  disabled={startingLife <= 10}
                >
                  -
                </button>
                <span>{startingLife}</span>
                <button onClick={() => setStartingLife((prev) => prev + 10)}>+</button>
              </div>
              {gameMode === 'jumpstart' && (
                <div css={styles.plusMinus}>
                  <label>Number of Jumpstart Decks</label>
                  <button
                    onClick={() => setNumberOfRandomDecks((prev) => prev - 1)}
                    disabled={numberOfRandomDecks === 1}
                  >
                    -
                  </button>
                  <span>{numberOfRandomDecks}</span>
                  <button
                    onClick={() => setNumberOfRandomDecks((prev) => prev + 1)}
                    disabled={numberOfRandomDecks === 4}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            {gameMode === 'jumpstart' && (
              <Fragment>
                <div css={styles.ruler}>Collected Jumpstart Decks</div>
                <DecklistEditor />
              </Fragment>
            )}
          </div>
        </div>
      )}
    </Fragment>
  )
}

const styles = {
  settingsPaneWrapper: css`
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  curtain: css`
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 1;
  `,
  settingsPane: css`
    z-index: 2;
    width: 80vw;
    max-height: 70vh;
    background-color: #ffffffee;
    border: 12px solid black;
    overflow-y: auto;
    padding: 24px;
  `,
  section: css`
    display: flex;
    flex-wrap: wrap;
    row-gap: 24px;
    column-gap: 32px;
    justify-items: center;
    justify-content: center;
  `,
  gameModeButtons: css`
    display: flex;
    flex-wrap: wrap;
    row-gap: 24px;
    justify-content: space-evenly;
  `,
  ruler: css`
    margin: 32px 0;
    border-top: 8px solid black;
    font-size: 18px;
    text-align: center;
  `,
  plusMinus: css`
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    label {
      margin-right: 12px;
    }
  `,
}
