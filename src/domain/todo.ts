export type TodoStatus = 'todo' | 'in_progress' | 'done';

export interface Todo {
  id: number;
  title: string;
  status: TodoStatus;
  createdAt: Date;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoStatusInput {
  status: TodoStatus;
}
