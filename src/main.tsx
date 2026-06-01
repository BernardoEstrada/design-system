import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div data-theme="navigator" className="p-8">
      <h1 className="text-3xl font-bold text-primary">Design System</h1>
      <p className="text-base-content mt-2">Run `pnpm dev` to open Storybook.</p>
    </div>
  </React.StrictMode>
)
