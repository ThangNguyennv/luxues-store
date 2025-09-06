/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { HomeInterface } from '~/types/home.type'

interface HomeContextType {
  dataHome: HomeInterface
  setDataHome: (dataHome: HomeInterface | null) => void
}

const HomeContext = createContext<HomeContextType | undefined>(undefined)

export const HomeClientProvider = ({ children }: { children: ReactNode }) => {
  const [dataHome, setDataHomeState] = useState<HomeInterface>({} as HomeInterface)

  const setDataHome = (dataHome: HomeInterface | null) => {
    setDataHomeState(dataHome ?? ({} as HomeInterface))
  }

  return (
    <HomeContext.Provider value={{ dataHome, setDataHome }}>
      {children}
    </HomeContext.Provider>
  )
}

export const useHome = () => {
  const context = useContext(HomeContext)
  if (!context) throw new Error('useHome must be used inside HomeProvider')
  return context
}