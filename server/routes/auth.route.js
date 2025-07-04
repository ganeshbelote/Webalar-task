import express from 'express'
import { registerUser, loginUser, refreshAccessToken } from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/v1/register').post(registerUser)
router.route('/v1/login').post(loginUser)
router.route('/v1/refresh').get(refreshAccessToken)

export default router