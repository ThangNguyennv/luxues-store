import { Request, Response } from 'express'
import SettingsGeneral from '../../models/settings-general.model'

// [PATCH] /admin/settings/general
export const generalPatch = async (req: Request, res: Response) => {
  try {
    const settingsGeneral = await SettingsGeneral.findOne({})
    if (settingsGeneral) {
      await SettingsGeneral.updateOne({ _id: settingsGeneral.id }, req.body)
    } else {
      const record = new SettingsGeneral(req.body)
      await record.save()
    }
    res.json({
      code: 200,
      message: 'Cập nhật cài đặt chung thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
