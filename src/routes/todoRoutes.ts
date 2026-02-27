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

const updateTitleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be at most 120 characters')
});

const listQuerySchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  search: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  sortBy: z.enum(['createdAt', 'title']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

function parseId(rawId: string): number {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid id');
  }

  return id;
}

export function createTodoRouter(todoService: TodoService): Router {
  const router = Router();

  router.get('/', (req, res) => {
    const queryResult = listQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      return res.status(400).json({
        message: 'Invalid query params',
        issues: queryResult.error.flatten()
      });
    }

    const result = todoService.listTodos(queryResult.data);
    return res.json(result);
  });

  router.get('/stats', (_req, res) => {
    return res.json(todoService.getStats());
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
    let id: number;

    try {
      id = parseId(req.params.id);
    } catch {
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

  router.patch('/:id/title', (req, res) => {
    let id: number;

    try {
      id = parseId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const parseResult = updateTitleSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Invalid request body',
        issues: parseResult.error.flatten()
      });
    }

    try {
      const todo = todoService.updateTitle(id, parseResult.data);
      return res.json(todo);
    } catch (error) {
      if (error instanceof Error && error.message === 'Todo not found') {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Unexpected error' });
    }
  });

  router.delete('/:id', (req, res) => {
    let id: number;

    try {
      id = parseId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid id' });
    }

    try {
      todoService.deleteTodo(id);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Todo not found') {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Unexpected error' });
    }
  });

  return router;
}
