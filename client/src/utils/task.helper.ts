import ensureAuth from './ensureAuth.helper'
// const baseUrl: string = 'http://localhost:5000'
import baseUrl from './baseUrl'
import type { CreateTaskType } from '../utils/types';

type refinedTaskDetailsType = {
  title: string
  description: string
  priority: string
  status: string
  assignedTo: string | undefined
}

const getTasks = async () => {
  const route = '/api/task/v1/'
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

export default getTasks

export const createTask = async (taskDetails : CreateTaskType)=> {
  const route = '/api/task/v1/'
  const finalUrl = `${baseUrl}${route}`
  const accessToken = localStorage.getItem('accessToken')

  const refinedTaskDetails : refinedTaskDetailsType = {
    title: taskDetails.title,
    description: taskDetails.description,
    priority: taskDetails.priority,
    status: taskDetails.status,
    assignedTo: taskDetails.assignedTo?.id
  }

  try {
    let res = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(refinedTaskDetails)
    })

    if (res.status === 401) {
      const refreshResult = await ensureAuth()
      if (refreshResult?.accessToken) {
        const newAccessToken = refreshResult.accessToken

        res = await fetch(finalUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newAccessToken}`
          },
          body: JSON.stringify(refinedTaskDetails)
        })
      } else {
        throw new Error('Session expired. Please login again.')
      }
    }

    const data = await res.json()
    if (!res.ok) {
      return { message: data.message }
    }

    const updatedData = await getTasks()
    return updatedData
  } catch (error) {
    console.log('Error :' + error)
    return `Error : ${error}`
  }
}

export const deleteTask = async (taskId : string)=> {
  const route = `/api/task/v1/${taskId}`
  const finalUrl = `${baseUrl}${route}`
  const accessToken = localStorage.getItem('accessToken')

  try {
    let res = await fetch(finalUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
    })

    if (res.status === 401) {
      const refreshResult = await ensureAuth()
      if (refreshResult?.accessToken) {
        const newAccessToken = refreshResult.accessToken

        res = await fetch(finalUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newAccessToken}`
          },
        })
      } else {
        throw new Error('Session expired. Please login again.')
      }
    }

    const data = await res.json()
    if (!res.ok) {
      return { message: data.message }
    }

    const updatedData = await getTasks()
    return updatedData
  } catch (error) {
    console.log('Error :' + error)
    return `Error : ${error}`
  }
}
