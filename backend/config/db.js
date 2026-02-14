import mongoose from 'mongoose'

let isMongoConnected = false

const connectDB = async () => {
  const maxRetries = 5
  let retries = 0

  while (retries < maxRetries) {
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-platform'
      
      // Build connection options
      const options = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
      }
      
      // Only add TLS options for MongoDB Atlas (mongodb+srv://)
      if (mongoURI.startsWith('mongodb+srv://')) {
        options.tls = true
        options.tlsInsecure = true // Allow self-signed certificates
        options.authSource = 'admin'
      }
      
      await mongoose.connect(mongoURI, options)
      isMongoConnected = true
      console.log('✅ MongoDB connected successfully')
      return
    } catch (err) {
      retries++
      console.error(`⚠️  MongoDB connection attempt ${retries}/${maxRetries} failed:`, err.message)
      if (retries < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retries), 5000)
        console.log(`⏳ Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        isMongoConnected = false
        console.error('❌ MongoDB connection failed after all retries')
        console.warn('⚠️  Running in offline mode (data will not persist)')
        // Don't exit, allow app to run in memory-only mode
      }
    }
  }
}

export { connectDB, isMongoConnected }
export const getMongoStatus = () => isMongoConnected
