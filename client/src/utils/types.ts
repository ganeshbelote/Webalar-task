export type UserType = {
  _id: string;
  username?: string;
  email: string;
  password: string;
};

export type AssignedToType = {
  id: string;
  username?: string;
};

export type TaskType = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: AssignedToType | null;
};

export type CreateTaskType = Omit<TaskType, '_id'>;

export type ActivityLogType = {
  action: string;
  task: TaskType;
  timestamp: string;
  user: UserType;
};
