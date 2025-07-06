import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import AppRouter from './AppRouter'
import { SmoothScrollProvider } from './components/animations/SmoothScrollProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <SmoothScrollProvider>
        <AppRouter />
      </SmoothScrollProvider>
    </HelmetProvider>
  </StrictMode>,
)
