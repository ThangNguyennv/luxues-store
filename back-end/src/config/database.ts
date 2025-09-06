/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import mongoose from 'mongoose'

export const connect = async (): Promise<void> => {
  console.log(process.env.MONGO_URL)
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connect success!')
  } catch (error) {
    console.log('Connect error!' + error)
  }
}
