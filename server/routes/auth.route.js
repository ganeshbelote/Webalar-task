import express from 'express'
import ensureAuth from '../middlewares/ensureAuth.js'
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getAllUsers
} from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/v1/register').post(registerUser)
router.route('/v1/login').post(loginUser)
router.route('/v1/refresh').get(refreshAccessToken)
router.route('/v1/users').get(ensureAuth, getAllUsers)

export default router
