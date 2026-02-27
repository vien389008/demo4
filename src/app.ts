import express from 'express';
import { TodoRepository } from './repositories/todoRepository';
import { createTodoRouter } from './routes/todoRoutes';
import { TodoService } from './services/todoService';

export function createApp() {
  const app = express();
  const todoRepository = new TodoRepository();
  const todoService = new TodoService(todoRepository);

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/todos', createTodoRouter(todoService));

  return app;
}
