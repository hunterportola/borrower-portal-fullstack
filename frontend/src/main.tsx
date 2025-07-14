import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './store/store.ts'      // <-- 1. IMPORT THE STORE
import { Provider } from 'react-redux'     // <-- 2. IMPORT THE PROVIDER

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* <-- 3. WRAP YOUR APP */}
      <App />
    </Provider>
  </StrictMode>,
)