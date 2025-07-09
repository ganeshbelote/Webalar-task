import ensureAuth from './ensureAuth.helper'

const baseUrl: string = 'http://localhost:5000'

const updateTask = async (task: any) => {
  const route = `/api/task/v1/${task._id}`
  const finalUrl = `${baseUrl}${route}`
  let accessToken = localStorage.getItem('accessToken')

  try {
    let res = await fetch(finalUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(task)
    })

    if (res.status === 401) {
      const refreshResult = await ensureAuth()
      if (refreshResult?.accessToken) {
        accessToken = refreshResult.accessToken
        localStorage.setItem('accessToken', accessToken)

        res = await fetch(finalUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(task)
        })
      } else {
        throw new Error('Session expired. Please login again.')
      }
    }

    const data = await res.json()

    if (!res.ok) {
      return { message: data.message, status: res.status }
    }

    return data
  } catch (error) {
    console.log('Error: ' + error)
    return { message: `Error: ${error}`, status: 500 }
  }
}

export default updateTask
