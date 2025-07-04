import express from 'express'
import { getRecentLogs } from '../controllers/log.controller.js'
import ensureAuth from '../middlewares/ensureAuth.js'

const router = express.Router()

router.get('/v1/', ensureAuth, getRecentLogs)

export default router
