import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import { ReviewStoreProvider } from './store/ReviewStore'
import { ToastProvider } from './components/Toast/Toast'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ReviewStoreProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ReviewStoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
