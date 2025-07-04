import { verifyAccessToken } from '../utils/verifyToken.js'

const ensureAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.body.token

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Unauthorized Access !'
    })
  }

  try {
    const decoded = verifyAccessToken(token)
    const { exp, iat, nbf, ...cleanPayload } = decoded
    req.user = cleanPayload
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        message: 'Access token expired!'
      })
    }
    return res.status(401).json({
      ok: false,
      message: 'Invalid token!'
    })
  }
}

export default ensureAuth