export type TodoStatus = 'todo' | 'in_progress' | 'done';

export interface Todo {
  id: number;
  title: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoStatusInput {
  status: TodoStatus;
}

export interface UpdateTodoTitleInput {
  title: string;
}

export interface TodoListQuery {
  status?: TodoStatus;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'title';
  order?: 'asc' | 'desc';
}

export interface TodoStats {
  total: number;
  byStatus: Record<TodoStatus, number>;
}
