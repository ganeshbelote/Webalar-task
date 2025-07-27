import { useEffect, useState } from 'react';
import { getAllUsers } from '../utils/auth.helper';
import type { CreateTaskType } from '../utils/types';

interface AllUsersProps {
  newTask: CreateTaskType;
  setNewTask: React.Dispatch<React.SetStateAction<CreateTaskType>>;
}

const AllUsers: React.FC<AllUsersProps> = ({ newTask, setNewTask }) => {
  const [users, setUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        const userMap: Record<string, string> = result.reduce(
          (acc: Record<string, string>, user: any) => {
            acc[user._id] = user.username || '';
            return acc;
          },
          {}
        );
        setUsers(userMap);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

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
          },
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
  );
};

export default AllUsers;
