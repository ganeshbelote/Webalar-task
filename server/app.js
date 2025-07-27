import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import userRoute from './routes/auth.route.js'
import taskRoute from './routes/task.route.js'
import logRoute from './routes/log.route.js'
import cors from 'cors'

const app = express()

app.use(cors(
  {
    origin: 'https://todowebappbyganesh.netlify.app/',  
    credentials: true, 
  }
)) 
app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use('/api/auth', userRoute)
app.use('/api/task', taskRoute)
app.use('/api/logs', logRoute)

export { app }
