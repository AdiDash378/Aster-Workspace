import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'token'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

export const sendTokenCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_MS,
  })
}

export const clearTokenCookie = (res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' })
}