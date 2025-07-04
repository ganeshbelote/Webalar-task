import { app } from './app.js'
import http from 'http'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import path from 'path'
import connectDB from './db/db.js'

dotenv.config({
  path: path.resolve(process.cwd(), `.env`),
  debug: process.env.NODE_ENV === 'production',
  encoding: 'utf8'
})

let io 

connectDB()
  .then(() => {
    const server = http.createServer(app)
    io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
      }
    })

    io.on('connection', socket => {
      console.log('Socket connected:', socket.id)

      socket.on('task_updated', task => {
        socket.broadcast.emit('task_updated', task)
      })

      socket.on('task_created', task => {
        socket.broadcast.emit('task_created', task)
      })

      socket.on('task_deleted', taskId => {
        socket.broadcast.emit('task_deleted', taskId)
      })
    })

    const port = process.env.PORT

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch(err => {
    console.log('We cannot connect to server ; Error :' + err.message)
  })

export { io } 

