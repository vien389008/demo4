import type { CreateTodoInput, Todo, UpdateTodoStatusInput } from '../domain/todo';
import { TodoRepository } from '../repositories/todoRepository';

export class TodoService {
  constructor(private readonly repository: TodoRepository) {}

  public listTodos(): Todo[] {
    return this.repository.findAll();
  }

  public createTodo(input: CreateTodoInput): Todo {
    return this.repository.create(input.title.trim());
  }

  public updateStatus(id: number, input: UpdateTodoStatusInput): Todo {
    const updatedTodo = this.repository.updateStatus(id, input.status);
    if (!updatedTodo) {
      throw new Error('Todo not found');
    }

    return updatedTodo;
  }
}
