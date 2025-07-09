import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logger from '../utils/logger'
import '../style/Home.css'
import getTasks, { createTask, deleteTask } from '../utils/task.helper'
import AllUsers from '../components/AllUsers'
import { failureMsg, successMsg } from '../utils/message.helper'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import updateTask from '../utils/updateTask.helper' // You'll need this helper

type userType = {
  username: string
  gmail: string
}

type tasksType =
  | {
      title: string
      status: string
    }
  | any
  | null

type uniqueTaskType = {
  title: string
  description: string
  status: string
  priority: string
  assignedTo?: userType | { id: string; username: string }
}

type activityLogType = {
  action: string
  task: tasksType
  timestamp: string
  user: userType
}

const Home = () => {
  const navigate = useNavigate()
  const [showCreateTask, setShowCreateTask] = useState<boolean>(false)
  const [logs, setLogs] = useState<Array<activityLogType>>([])
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState<uniqueTaskType>({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    assignedTo: { id: '', username: '' }
  })

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      navigate('/login')
      return
    }
    const fetchLogs = async () => {
      const result: Array<activityLogType> = await logger()
      setLogs(result)
    }
    const fetchTaks = async () => {
      const result = await getTasks()
      setTasks(result)
    }

    fetchTaks()
    fetchLogs()
  }, [])

  const handleCreateNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const handlecreateNewTask = async task => {
      const result = await createTask(task)
      console.log(result)
      if (result.message) {
        failureMsg(result.message)
        setShowCreateTask(false)
        return
      }
      setTasks(result)
      successMsg('New Task created Successfully.')
    }
    handlecreateNewTask(newTask)
    setNewTask({
      title: '',
      description: '',
      status: 'Todo',
      priority: 'Medium',
      assignedTo: { id: '', username: '' }
    })
    setShowCreateTask(false)
  }

  const handleDeleteTask = (taskId: string) => {
    const deleteTaskById = async id => {
      const result = await deleteTask(id)
      console.log(result)
      if (result.message) {
        failureMsg(result.message)
        setShowCreateTask(false)
        return
      }
      setTasks(result)
      successMsg('New Task deleted Successfully.')
    }
    deleteTaskById(taskId)
  }

  return (
    <div className='board-container'>
      <aside className='activity-log'>
        <div className='activity-log-heading'>
          <h3>Activity Log</h3>
          <p className='log-subtitle'>Last 20 actions</p>
        </div>
        <ul>
          {logs.map((log, idx) => (
            <li key={idx}>
              <span>{log?.timestamp?.split('T')[0]}</span> :{' '}
              <strong>{log?.action}</strong>
              {log.user || log.task ? (
                <p>
                  {log?.task?.title} - by <span>{log?.user?.username}</span>
                </p>
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
      </aside>

      <main className='kanban-board'>
        <h2>Kanban board</h2>
        <DragDropContext
          onDragEnd={async result => {
            const { source, destination, draggableId } = result
            if (
              !destination ||
              (source.droppableId === destination.droppableId &&
                source.index === destination.index)
            )
              return

            const movedTask = tasks.find(task => task._id === draggableId)
            if (!movedTask) return

            const updatedTask = {
              ...movedTask,
              status: destination.droppableId
            }

            // Update frontend state
            setTasks(prev =>
              prev.map(task =>
                task._id === draggableId
                  ? { ...task, status: destination.droppableId }
                  : task
              )
            )

            // Call API to update backend
            try {
              await updateTask(updatedTask)
            } catch (error) {
              console.error('Failed to update task status:', error)
            }
          }}
        >
          <div className='columns'>
            {['Todo', 'In Progress', 'Done'].map(col => (
              <Droppable droppableId={col} key={col}>
                {provided => (
                  <div
                    className={`column ${col}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className='column-header'>
                      <h4>{col}</h4>
                      {col === 'Todo' && (
                        <button
                          onClick={() => setShowCreateTask(true)}
                          className='add-btn'
                        >
                          + New Task
                        </button>
                      )}
                      {col === 'In Progress' && (
                        <button className='smart-assign-btn'>
                          Smart Assign
                        </button>
                      )}
                    </div>

                    {tasks
                      .filter(task => task.status === col)
                      .map((task, index) => (
                        <Draggable
                          draggableId={task._id}
                          index={index}
                          key={task._id}
                        >
                          {provided => (
                            <div
                              className='task-card'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className='cross-sm'
                              >
                                x
                              </button>
                              <div>
                                <h5>{task.title}</h5>
                                <p>{task?.description}</p>
                                <div className='taskUserWrapper'>
                                  {task?.assignedTo?.username && (
                                    <div className='assigned'>
                                      <span className='avatar'>{}</span>{' '}
                                      {task.assignedTo.username}
                                    </div>
                                  )}
                                  {task.priority && (
                                    <span
                                      className={`priority ${task.priority.toLowerCase()}`}
                                    >
                                      {task.priority}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </main>

      {showCreateTask ? (
        <div className='addTask'>
          <div className='form-wrapper'>
            <button onClick={() => setShowCreateTask(false)} className='cross'>
              X
            </button>
            <h2 className='heading'>New Task</h2>
            <form onSubmit={e => handleCreateNewTask(e)} className='form'>
              <input
                id='title'
                className='input'
                placeholder='Title'
                value={newTask.title}
                type='text'
                onChange={e =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />

              <input
                id='description'
                className='input'
                placeholder='Description'
                value={newTask.description}
                type='text'
                onChange={e =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />

              <select
                id='status'
                className='input custom-select'
                value={newTask.status}
                onChange={e =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
              >
                <option value='' disabled>
                  Select status
                </option>
                {['Todo', 'In Progress', 'Done'].map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                id='priority'
                className='input custom-select'
                value={newTask.priority}
                onChange={e =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option value='' disabled>
                  Select priority
                </option>
                {['Low', 'Medium', 'High'].map(priority => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>

              <AllUsers newTask={newTask} setNewTask={setNewTask} />

              <button className='auth-btn' type='submit'>
                Create Task
              </button>
            </form>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Home
