import React, { useEffect, useState } from 'react'
import { getAllUsers } from '../utils/auth.helper'

const AllUsers = ({ newTask , setNewTask }) => {
  const [users, setUsers] = useState({}) 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers()
        const userMap = result.reduce((acc, user) => {
          acc[user._id] = user.username
          return acc
        }, {})
        setUsers(userMap)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }
    fetchUsers()
  }, [])

  return (
    <select
      id='assignedTo'
      className='input custom-select'
      value={newTask.assignedTo?.id || ''}
      onChange={e =>
        setNewTask({
          ...newTask,
         assignedTo: {
      id: e.target.value,
      username: users[e.target.value],
    }
        })
      }
    >
      <option value='' disabled>
        Select user
      </option>
      {Object.entries(users).map(([id, username]) => (
        <option key={id} value={id}>
          {username}
        </option>
      ))}
    </select>
  )
}

export default AllUsers
