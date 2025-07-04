import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logger from '../utils/logger'
import ensureAuth from '../utils/ensureAuth.helper'
import '../style/Home.css'

type tasksType = { 
  todo : object[],
  inProgress : object[],
  done : object[]
} | any

type uniqueTaskType = {
  title : string,
  priority : string,
  assigned : string

}

const tasks : tasksType = {
  todo: [
    { title: 'Design mockups', priority: 'High', assigned: 'Ganesh' },
    { title: 'Write documentation', priority: '', assigned: '' }
  ],
  inProgress: [
    { title: 'Implement feature', priority: '', assigned: 'Ravi' },
    { title: 'Fix bug in code', priority: '', assigned: '' }
  ],
  done: [
    { title: 'Refactor component', priority: 'Low', assigned: 'Priya' },
    { title: 'Update dependencies', priority: '', assigned: '' }
  ]
}

const activityLog = [
  { user: 'Ganesh', time: '4m ago' },
  { user: 'Ganesh', time: '30m ago' },
  { user: 'Priya', time: '30m ago' },
  { user: 'Ganesh', time: '24m ago' },
  { user: 'Priya', time: '23m ago' }
]

const Home = () => {
  const navigate = useNavigate()
  const [logs, setLogs] = useState<Array<object>>([])

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      navigate('/login')
      return
    }
    const fetchLogs = async () => {
      const result: object[] = await logger()
      const token = await ensureAuth()
      console.log(token)
      setLogs(result)
    }

    fetchLogs()
  }, [])

  useEffect(() => {
    console.log(logs)
  }, [logs])

  return (
    <div className="board-container">
      <aside className="activity-log">
        <h3>Activity Log</h3>
        <p className="log-subtitle">Last 20 actions</p>
        <ul>
          {activityLog.map((log, idx) => (
            <li key={idx}>
              <span>{log.time}</span> <strong>{log.user}</strong>
            </li>
          ))}
        </ul>
      </aside>

      <main className="kanban-board">
        <h2>Kanban board</h2>
        <div className="columns">
          {['todo', 'inProgress', 'done'].map((col, i) => (
            <div className={`column ${col}`} key={col}>
              <div className="column-header">
                <h4>
                  {col === 'todo'
                    ? 'Todo'
                    : col === 'inProgress'
                    ? 'In Progress'
                    : 'Done'}
                </h4>
                {col === 'todo' && <button className="add-btn">+ New Task</button>}
                {col === 'inProgress' && (
                  <button className="smart-assign-btn">Smart Assign</button>
                )}
              </div>
              {tasks[col].map((task : uniqueTaskType, index : number) => (
                <div className="task-card" key={index}>
                  <h5>{task.title}</h5>
                  {task.assigned && (
                    <div className="assigned">
                      <span className="avatar">{task.assigned[0]}</span> {task.assigned}
                    </div>
                  )}
                  {task.priority && <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
