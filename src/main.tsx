import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { getFirebaseConfig } from './firebase-config'
import { initializeApp } from 'firebase/app'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const firbaseAppConfig = getFirebaseConfig()
initializeApp(firbaseAppConfig)


