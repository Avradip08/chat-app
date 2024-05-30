import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { AppRouter } from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={AppRouter}>
      <App />
    </RouterProvider>
  </React.StrictMode>,
)
