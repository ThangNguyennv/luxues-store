/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { SettingGeneralDetailInterface } from '~/types/setting.type'

interface SettingGeneralContextType {
    settingGeneral: SettingGeneralDetailInterface['settingGeneral'] | null
    setSettingGeneral: (settingGeneral: SettingGeneralDetailInterface['settingGeneral'] | null) => void
}

const SettingContext = createContext<SettingGeneralContextType | undefined>(undefined)

export const SettingGeneralProvider = ({ children }: { children: ReactNode }) => {
  const [settingGeneral, setSettingGeneral] = useState<SettingGeneralContextType['settingGeneral']>(null)
  return (
    <SettingContext.Provider value={{ settingGeneral, setSettingGeneral }}>
      {children}
    </SettingContext.Provider>
  )
}

export const useSettingGeneral = () => {
  const context = useContext(SettingContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}