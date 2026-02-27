import type { Todo, TodoListQuery, TodoStats, TodoStatus } from '../domain/todo';

export class TodoRepository {
  private todos: Todo[] = [];
  private nextId = 1;

  public findAll(query?: TodoListQuery): Todo[] {
    const filtered = this.todos.filter((todo) => {
      if (query?.status && todo.status !== query.status) {
        return false;
      }

      if (query?.search) {
        const search = query.search.toLowerCase();
        if (!todo.title.toLowerCase().includes(search)) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const sortBy = query?.sortBy ?? 'createdAt';
      const order = query?.order ?? 'desc';

      if (sortBy === 'title') {
        const result = a.title.localeCompare(b.title);
        return order === 'asc' ? result : -result;
      }

      const result = a.createdAt.getTime() - b.createdAt.getTime();
      return order === 'asc' ? result : -result;
    });

    const offset = query?.offset ?? 0;
    const limit = query?.limit ?? sorted.length;
    return sorted.slice(offset, offset + limit);
  }

  public count(query?: Pick<TodoListQuery, 'status' | 'search'>): number {
    return this.findAll({ ...query, limit: Number.MAX_SAFE_INTEGER, offset: 0 }).length;
  }

  public findById(id: number): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  public create(title: string): Todo {
    const now = new Date();
    const todo: Todo = {
      id: this.nextId,
      title,
      status: 'todo',
      createdAt: now,
      updatedAt: now
    };

    this.nextId += 1;
    this.todos.push(todo);
    return todo;
  }

  public updateStatus(id: number, status: TodoStatus): Todo | undefined {
    const todo = this.findById(id);
    if (!todo) {
      return undefined;
    }

    todo.status = status;
    todo.updatedAt = new Date();
    return todo;
  }

  public updateTitle(id: number, title: string): Todo | undefined {
    const todo = this.findById(id);
    if (!todo) {
      return undefined;
    }

    todo.title = title;
    todo.updatedAt = new Date();
    return todo;
  }

  public deleteById(id: number): boolean {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return false;
    }

    this.todos.splice(index, 1);
    return true;
  }

  public getStats(): TodoStats {
    const byStatus: Record<TodoStatus, number> = {
      todo: 0,
      in_progress: 0,
      done: 0
    };

    this.todos.forEach((todo) => {
      byStatus[todo.status] += 1;
    });

    return {
      total: this.todos.length,
      byStatus
    };
  }
}
