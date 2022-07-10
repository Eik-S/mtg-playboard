import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import reportWebVitals from './reportWebVitals'
import { css, Global } from '@emotion/react'

const globalStyles = css`
  body {
    margin: 0;
    background-color: #666;
    font-family: 'Arial Rounded MT Bold', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  button {
    border: 6px solid black;
    border-radius: 12px;
    background-color: #ffffff;
    font-size: 16px;
    font-weight: 900;
    line-height: 24px;
    text-transform: uppercase;
    padding: 4px 12px;
    margin: 0 12px;
    color: black;
    cursor: pointer;
    &:disabled {
      cursor: default;
      color: #00000066;
      border-color: #00000066;
    }
  }
`

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// disable scrolling/panning
document.body.addEventListener('touchmove', (e: Event) => e.preventDefault(), {
  passive: false,
  capture: false,
})

root.render(
  <React.StrictMode>
    <Global styles={globalStyles} />
    <App />
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
