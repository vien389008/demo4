import type { Todo, TodoStatus } from '../domain/todo';

export class TodoRepository {
  private todos: Todo[] = [];
  private nextId = 1;

  public findAll(): Todo[] {
    return [...this.todos];
  }

  public findById(id: number): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  public create(title: string): Todo {
    const todo: Todo = {
      id: this.nextId,
      title,
      status: 'todo',
      createdAt: new Date()
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
    return todo;
  }
}
