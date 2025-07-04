const baseUrl: string = 'http://localhost:5000'

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
