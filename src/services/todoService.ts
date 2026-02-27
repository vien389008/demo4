import type {
  CreateTodoInput,
  Todo,
  TodoListQuery,
  TodoStats,
  UpdateTodoStatusInput,
  UpdateTodoTitleInput
} from '../domain/todo';
import { TodoRepository } from '../repositories/todoRepository';

export class TodoService {
  constructor(private readonly repository: TodoRepository) {}

  public listTodos(query?: TodoListQuery): { items: Todo[]; total: number } {
    const items = this.repository.findAll(query);
    const total = this.repository.count({ status: query?.status, search: query?.search });

    return { items, total };
  }

  public createTodo(input: CreateTodoInput): Todo {
    const title = input.title.trim();
    return this.repository.create(title);
  }

  public updateStatus(id: number, input: UpdateTodoStatusInput): Todo {
    const updatedTodo = this.repository.updateStatus(id, input.status);
    if (!updatedTodo) {
      throw new Error('Todo not found');
    }

    return updatedTodo;
  }

  public updateTitle(id: number, input: UpdateTodoTitleInput): Todo {
    const title = input.title.trim();
    const updatedTodo = this.repository.updateTitle(id, title);

    if (!updatedTodo) {
      throw new Error('Todo not found');
    }

    return updatedTodo;
  }

  public deleteTodo(id: number): void {
    const deleted = this.repository.deleteById(id);
    if (!deleted) {
      throw new Error('Todo not found');
    }
  }

  public getStats(): TodoStats {
    return this.repository.getStats();
  }
}
