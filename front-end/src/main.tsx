import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CssBaseline from '@mui/material/CssBaseline'
import { AlertToast } from './components/alert/Alert.tsx'
import { AppProviders } from './AppProviders.tsx'

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <CssBaseline />
    <App />
    <AlertToast />
  </AppProviders>
)
