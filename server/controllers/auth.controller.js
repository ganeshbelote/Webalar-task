import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import {
  generateAccessToken,
  generateRefreshToken
} from '../utils/generateToken.js'
import { verifyRefreshToken } from '../utils/verifyToken.js'

export const registerUser = async (req, res) => {
  try {
    const username = req.body.username?.trim()
    const email = req.body.email?.trim()
    const password = req.body.password?.trim()

    if (!username || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'All fields are compulsory !'
      })
    }

    const isValidGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)

    if (!isValidGmail) {
      return res.status(400).json({
        ok: false,
        message: 'Email is not in correct formate !'
      })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

    const isStrongPassword = passwordRegex.test(password)

    if (!isStrongPassword) {
      return res.status(400).json({
        ok: false,
        message:
          'Password must be at least 8 characters, include uppercase, lowercase, number, and special character'
      })
    }

    const existingUser = await User.findOne({
      $or: [{ email: { $regex: `^${email}$`, $options: 'i' } }, { username }]
    })

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: 'User already exists with given credentials.'
      })
    }

    const user = await User.create({
      username,
      email,
      password
    })

    if (!user) {
      return res.status(503).json({
        ok: false,
        message: 'User not created, Please try again later !'
      })
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      Email: user.email
    })
    const refreshToken = generateRefreshToken({
      userId: user._id,
      Email: user.email
    })

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }

    res.cookie('refreshToken', refreshToken, cookieOptions)

    return res.status(200).json({
      ok: true,
      message: 'User logged in successfully !',
      accessToken,
      user
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Internal Server Error ! Error : ' + error.message
    })
  }
}

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim()
    const password = req.body.password?.trim()

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'All fields are compulsory !'
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid email or password.'
      })
    }

    const decodedPassword = await bcrypt.compare(password, user.password)

    if (!decodedPassword) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid email or password.'
      })
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      Email: user.email
    })
    const refreshToken = generateRefreshToken({
      userId: user._id,
      Email: user.email
    })

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }

    res.cookie('refreshToken', refreshToken, cookieOptions)

    return res.status(200).json({
      ok: true,
      message: 'User logged in successfully !',
      accessToken,
      user
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: `Internal Server Error ! Error : ${error.message}`
    })
  }
}

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(403).json({
        ok: false,
        message: 'Refresh token not found !'
      })
    }

    const payload = verifyRefreshToken(refreshToken)

    // ✅ Remove fields that jwt.sign does not allow
    const { exp, iat, nbf, ...cleanPayload } = payload

    const newAccessToken = generateAccessToken(cleanPayload)

    return res.status(200).json({
      ok: true,
      message: 'New access token created successfully !',
      accessToken: newAccessToken
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: `Internal Server Error ! Error : ${error.message}`
    })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Server is unable to proceed request now, Please Try again !'
    })
  }
}
