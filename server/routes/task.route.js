import express from 'express'
import {
  createTask,
  deleteTask,
  getAllTasks,
  getSingleTask,
  reassignTask,
  smartAssignTask,
  updateTask
} from '../controllers/task.controller.js'
import ensureAuth from '../middlewares/ensureAuth.js'

const router = express.Router()

router
    .route('/v1/')
    .post(ensureAuth, createTask)
    .get(ensureAuth, getAllTasks)
router
  .route('/v1/:id')
  .get(ensureAuth, getSingleTask)
  .put(ensureAuth, updateTask)
  .delete(ensureAuth, deleteTask)
router.patch('/v1/:id/assign', ensureAuth, reassignTask)
router.patch('/v1/:id/smart-assign', ensureAuth, smartAssignTask)

export default router
