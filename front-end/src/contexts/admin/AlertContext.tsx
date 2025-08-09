import { createContext, useContext, useReducer } from 'react'
import { alertReducer, initialState } from '~/reducers/admin/alertReducer'
import type { AlertAction, AlertState } from '~/types'

interface AlertContextType {
  state: AlertState
  dispatch: React.Dispatch<AlertAction>
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: {children: React.ReactNode }) {
  const [state, dispatch] = useReducer(alertReducer, initialState)
  return (
    <AlertContext.Provider value={{ state, dispatch }}>
      {children}
    </AlertContext.Provider>
  )
}

export const useAlertContext = () => {
  const context = useContext(AlertContext)
  if (!context) throw new Error('useAlertContext must be used within AlertProvider')
  return context
}