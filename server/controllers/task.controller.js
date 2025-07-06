import Task from '../models/task.model.js'
import Log from '../models/log.model.js'
import User from '../models/user.model.js'
import { io } from '../index.js'

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, assignedTo } = req.body

    const existing = await Task.findOne({ title })
    if (existing) {
      return res.status(400).json({ message: 'Task title must be unique!' })
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status: status || 'Todo',
      assignedTo,
      updatedBy: req.user.id,
      lastUpdatedAt: new Date()
    })

    await Log.create({
      action: 'Created task',
      user: req.user.userId,
      task: task._id
    })

    io.emit('task_created', task)

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'username email')
      .populate('updatedBy', 'username')

    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

export const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findById(id)
      .populate('assignedTo', 'username email')
      .populate('updatedBy', 'username')

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, priority, assignedTo, lastUpdatedAt } = req.body

    const existingTask = await Task.findById(id)

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const serverTimestamp = new Date(existingTask.lastUpdatedAt).getTime()
    const clientTimestamp = new Date(lastUpdatedAt).getTime()

    if (clientTimestamp < serverTimestamp) {
      return res.status(409).json({
        message: 'Conflict detected',
        serverVersion: existingTask,
        clientVersion: req.body
      })
    }

    existingTask.title = title || existingTask.title
    existingTask.description = description || existingTask.description
    existingTask.status = status || existingTask.status
    existingTask.priority = priority || existingTask.priority
    existingTask.assignedTo = assignedTo || existingTask.assignedTo
    existingTask.updatedBy = req.user.id
    existingTask.lastUpdatedAt = new Date()

    const updatedTask = await existingTask.save()

    await Log.create({
      action: 'Updated task',
      user: req.user.userId,
      task: updatedTask._id
    })

    io.emit('task_updated', updatedTask)

    res.status(200).json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    const task = await Task.findById(id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    await Log.create({
      action: 'Deleted task',
      user: req.user.userId,
      task: task._id
    })

    io.emit('task_deleted', task._id)

    await task.deleteOne()

    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

export const reassignTask = async (req, res) => {
  try {
    const { id } = req.params
    const { userId : assignedUser } = req.body

    const task = await Task.findById(id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    task.assignedTo = assignedUser
    task.updatedBy = req.user.userId
    task.lastUpdatedAt = new Date()

    const updatedTask = await task.save()

    await Log.create({
      action: `Reassigned task to user ${assignedUser}`,
      user: req.user.userId,
      task: task._id
    })

    res.status(200).json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

export const smartAssignTask = async (req, res) => {
  try {
    const { id } = req.params

    const task = await Task.findById(id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const users = await User.find()

    let minUser = null
    let minTaskCount = Infinity

    for (const user of users) {
      const activeTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: { $ne: 'Done' }
      })

      if (activeTasks < minTaskCount) {
        minTaskCount = activeTasks
        minUser = user
      }
    }

    if (!minUser) {
      return res.status(404).json({ message: 'No users found for Smart Assign' })
    }

    task.assignedTo = minUser._id
    task.updatedBy = req.user.id
    task.lastUpdatedAt = new Date()

    const updatedTask = await task.save()

    await Log.create({
      action: `Smart assigned task to user ${minUser.username}`,
      user: req.user.userId,
      task: task._id
    })

    res.status(200).json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}
