import './i18n'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { store } from './store'
import { Provider as RollbarProvider } from '@rollbar/react'

// Конфигурация Rollbar
const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN,
  environment: import.meta.env.VITE_APP_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </RollbarProvider>
  </React.StrictMode>,
)
