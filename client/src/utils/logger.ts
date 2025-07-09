import ensureAuth from './ensureAuth.helper'
// const baseUrl: string = 'http://localhost:5000'
import baseUrl from './baseUrl'

const logger = async () => {
  const route = '/api/logs/v1/'
  const finalUrl = `${baseUrl}${route}`
  const accessToken = localStorage.getItem('accessToken')

  try {
    let res = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (res.status === 401) {
      const refreshResult = await ensureAuth()
      if (refreshResult?.accessToken) {
        const newAccessToken = refreshResult.accessToken

        res = await fetch(finalUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newAccessToken}`
          }
        })
      } else {
        throw new Error('Session expired. Please login again.')
      }
    }

    const data = await res.json()
    if (!res.ok) {
      return { message: data.message }
    }
    return data
  } catch (error) {
    console.log('Error :' + error)
    return `Error : ${error}`
  }
}

export default logger
