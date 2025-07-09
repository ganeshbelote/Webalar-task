const baseUrl: string = 'http://localhost:5000'
import ensureAuth from './ensureAuth.helper'

type userDataType = {
    username? : string,
    email : string,
    password : string
}

// data => user data email username password
export const register = async (userData: userDataType) => {
  const route: string = '/api/auth/v1/register'
  const finalUrl: string = `${baseUrl}${route}`

  try {
    const response = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(userData)
    })

    const result = await response.json()

    return result
  } catch (error) {
    console.log('Error :' + error)
  }
}

export const login = async (userData: userDataType) => {
  const route: string = '/api/auth/v1/login'
  const finalUrl: string = `${baseUrl}${route}`

  try {
    const response = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(userData)
    })

    const result = await response.json()

    return result
  } catch (error) {
    console.log('Error :' + error)
  }
}

export const getAllUsers = async () => {
  const route = '/api/auth/v1/users'
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


