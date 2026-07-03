import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/common/shared.css'
import MenuRouter from './MenuRouter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MenuRouter />
  </StrictMode>,
)
