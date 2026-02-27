import { Router } from 'express';
import { z } from 'zod';
import { TodoService } from '../services/todoService';

const createTodoSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be at most 120 characters')
});

const updateStatusSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done'])
});

export function createTodoRouter(todoService: TodoService): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    const todos = todoService.listTodos();
    res.json(todos);
  });

  router.post('/', (req, res) => {
    const parseResult = createTodoSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Invalid request body',
        issues: parseResult.error.flatten()
      });
    }

    const todo = todoService.createTodo(parseResult.data);
    return res.status(201).json(todo);
  });

  router.patch('/:id/status', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const parseResult = updateStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Invalid request body',
        issues: parseResult.error.flatten()
      });
    }

    try {
      const todo = todoService.updateStatus(id, parseResult.data);
      return res.json(todo);
    } catch (error) {
      if (error instanceof Error && error.message === 'Todo not found') {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Unexpected error' });
    }
  });

  return router;
}
