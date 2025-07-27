import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: 'Webalar_TODOApp',
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    })
    console.log('Connection to DB successful 👍')
  } catch (error) {
    console.log('Error : ' + error.message)
    process.exit(1)
  }
}

export default connectDB

/*
useNewUrlParser: true	=> Uses the new MongoDB connection string parser (recommended)
useUnifiedTopology: true	=> Enables the new server discovery engine (more stable)

caption : useUnifiedTopology & useNewUrlParser is a deprecated option: useUnifiedTopology & useNewUrlParser have no effect since Node.js Driver version 4.0.0 and will be removed in the next major version

dbName: 'devhub'	=> Forces DB name even if URI doesn't include one
autoIndex:  true    => Automatically builds indexes (good in dev; disable in production if indexing manually)
maxPoolSize: 10	=> Limits concurrent DB connections (helps prevent memory leaks)
serverSelectionTimeoutMS: 5000	=> How long Mongoose waits for a server to respond before throwing an error
socketTimeoutMS: 45000	=> Time after which inactive socket closes; helps avoid hanging requests
autoIndex: false	=> In production when you want to control indexing yourself (for performance)
retryWrites: true	=> Default; makes write operations retry on failure
w: 'majority'	=> Ensures writes are acknowledged by majority of nodes (safe writes)
*/