import { createContext, useContext, useReducer } from 'react'
import { alertReducer, initialState } from '~/reducers/admin/alertReducer'
import type { AlertActions, AlertStates } from '~/types'

interface AlertContextType {
  stateAlert: AlertStates
  dispatchAlert: React.Dispatch<AlertActions>
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: {children: React.ReactNode }) {
  const [stateAlert, dispatchAlert] = useReducer(alertReducer, initialState)
  return (
    <AlertContext.Provider value={{ stateAlert, dispatchAlert }}>
      {children}
    </AlertContext.Provider>
  )
}

export const useAlertContext = () => {
  const context = useContext(AlertContext)
  if (!context) throw new Error('useAlertContext must be used within AlertProvider')
  return context
}