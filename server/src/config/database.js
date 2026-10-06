import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI.replace(/\/(?=\?|$)/, '')
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    throw error
  }
}

export default connectDB