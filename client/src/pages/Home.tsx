import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logger from '../utils/logger';
import '../style/Home.css';
import getTasks, { createTask, deleteTask } from '../utils/task.helper';
import AllUsers from '../components/AllUsers';
import { failureMsg, successMsg } from '../utils/message.helper';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import updateTask from '../utils/updateTask.helper';
import socket from '../utils/socket';
import { verifyUser } from '../utils/ensureAuth.helper';

// --- Types ---
type UserType = {
  username: string;
  gmail: string;
};

type TaskType = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: UserType | { id: string; username: string };
};

type ActivityLogType = {
  action: string;
  task: TaskType;
  timestamp: string;
  user: UserType;
};

const Home = () => {
  const navigate = useNavigate();
  const [showActivityLog,setshowActivityLog] = useState<boolean>(false)
  const [showCreateTask, setShowCreateTask] = useState<boolean>(false);
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [newTask, setNewTask] = useState<Omit<TaskType, '_id'>>({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    assignedTo: { id: '', username: '' },
  });

  // Real-time socket listeners
  useEffect(() => {
    socket.on('task_created', (task: TaskType) => {
      successMsg(`Task created: ${task.title}`);
      setTasks(prev => [...prev, task]);
    });

    socket.on('task_updated', (updatedTask: TaskType) => {
      successMsg(`Task updated: ${updatedTask.title}`);
      setTasks(prev =>
        prev.map(task =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    });

    socket.on('task_deleted', (taskId: string) => {
      failureMsg(`Task deleted`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    });

    return () => {
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_deleted');
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
    const accessToken = localStorage.getItem('accessToken')

    // If access token not found, attempt to get a new one via refresh token
    if (!accessToken) {
      try {
        const newToken = await verifyUser()
        if (newToken?.accessToken) {
          localStorage.setItem('accessToken', newToken.accessToken)
        } else {
          navigate('/login')
        }
      } catch (err) {
        navigate('/login')
      }
    }
  }

  checkAuth()

    const fetchLogs = async () => {
      const result = await logger();
      setLogs(result);
    };

    const fetchTasks = async () => {
      const result = await getTasks();
      setTasks(result);
    };

    fetchTasks();
    fetchLogs();
  }, []);

  const handleCreateNewTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await createTask(newTask);
    if (result.message) {
      failureMsg(result.message);
      setShowCreateTask(false);
      return;
    }
    setTasks(result);
    successMsg('New Task created Successfully.');
    setNewTask({
      title: '',
      description: '',
      status: 'Todo',
      priority: 'Medium',
      assignedTo: { id: '', username: '' },
    });
    setShowCreateTask(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    const result = await deleteTask(taskId);
    if (result.message) {
      failureMsg(result.message);
      return;
    }
    setTasks(result);
    successMsg('Task deleted Successfully.');
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination ||
        (source.droppableId === destination.droppableId &&
        source.index === destination.index)) return;

    const movedTask = tasks.find(task => task._id === draggableId);
    if (!movedTask) return;

    const updatedTask = { ...movedTask, status: destination.droppableId };

    setTasks(prev =>
      prev.map(task =>
        task._id === draggableId ? updatedTask : task
      )
    );

    try {
      await updateTask(updatedTask);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleActivityLogScroll = () => {
    setshowActivityLog(prev => !prev)
  }

  return (
    <div className='board-container'>
      <button onClick={handleActivityLogScroll} className={`activity-log-btn ${showActivityLog?"active":""}`}>{">"}</button>
      {/* Left Activity Log */}
      <aside className={`activity-log ${showActivityLog?"show-activity-log":""}`}>
        <div className='activity-log-heading'>
          <h3>Activity Log</h3>
          <p className='log-subtitle'>Last 20 actions</p>
        </div>
        <ul>
          {logs.map((log, idx) => (
            <li key={idx}>
              <span>{log.timestamp.split('T')[0]}</span> : <strong>{log.action}</strong>
              {log.user || log.task ? (
                <p>{log.task?.title} - by <span>{log.user.username}</span></p>
              ) : null}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Kanban Board */}
      <main className='kanban-board'>
        <h2>Kanban board</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='columns'>
            {['Todo', 'In Progress', 'Done'].map(col => (
              <Droppable droppableId={col} key={col}>
                {(provided) => (
                  <div
                    className={`column ${col}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className='column-header'>
                      <h4>{col}</h4>
                      {col === 'Todo' && (
                        <button onClick={() => setShowCreateTask(true)} className='add-btn'>+ New Task</button>
                      )}
                      {/* {col === 'In Progress' && (
                        <button className='smart-assign-btn'>Smart Assign</button>
                      )} */}
                    </div>
                    {tasks.filter(task => task.status === col).map((task, index) => (
                      <Draggable draggableId={task._id} index={index} key={task._id}>
                        {(provided) => (
                          <div
                            className='task-card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className='cross-sm'
                            >x</button>
                            <div>
                              <h5>{task.title}</h5>
                              <p>{task.description}</p>
                              <div className='taskUserWrapper'>
                                {task.assignedTo?.username && (
                                  <div className='assigned'>
                                    Assigned to <span className='avatar'></span> {task.assignedTo.username}
                                  </div>
                                )}
                                {task.priority && (
                                  <span className={`priority ${task.priority.toLowerCase()}`}>
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

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className='addTask'>
          <div className='form-wrapper'>
            <button onClick={() => setShowCreateTask(false)} className='cross'>X</button>
            <h2 className='heading'>New Task</h2>
            <form onSubmit={handleCreateNewTask} className='form'>
              <input
                id='title'
                className='input'
                placeholder='Title'
                value={newTask.title}
                type='text'
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
              <input
                id='description'
                className='input'
                placeholder='Description'
                value={newTask.description}
                type='text'
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
              <select
                id='status'
                className='input custom-select'
                value={newTask.status}
                onChange={e => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value='' disabled>Select status</option>
                {['Todo', 'In Progress', 'Done'].map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select
                id='priority'
                className='input custom-select'
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value='' disabled>Select priority</option>
                {['Low', 'Medium', 'High'].map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              <AllUsers newTask={newTask} setNewTask={setNewTask} />
              <button className='auth-btn' type='submit'>Create Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
