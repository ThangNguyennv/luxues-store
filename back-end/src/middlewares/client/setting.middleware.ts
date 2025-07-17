import { Request, Response, NextFunction } from 'express'
import SettingsGeneral from '~/models/settings-general.model'
export const settingsGeneral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const settingsGeneral = await SettingsGeneral.findOne({})
  req['settingsGeneral'] = settingsGeneral
  next()
}
