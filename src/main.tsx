import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TokenContextProvider from './Context/TokenContext.tsx'
import UserContextProvider from './Context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(


  <StrictMode>
    <TokenContextProvider>
      <UserContextProvider>
    <App />
    </UserContextProvider>
    </TokenContextProvider>
  </StrictMode>,
)
