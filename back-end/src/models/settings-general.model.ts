import mongoose from 'mongoose'

const settingsGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String
  },
  {
    timestamps: true
  }
)

const SettingsGeneral = mongoose.model(
  'SettingsGeneral',
  settingsGeneralSchema,
  'settings-general'
)

export default SettingsGeneral
