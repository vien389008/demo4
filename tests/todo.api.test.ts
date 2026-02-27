import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app';

describe('Todo API', () => {
  it('creates and returns todo list', async () => {
    const app = createApp();

    const createResponse = await request(app).post('/todos').send({
      title: 'Learn Node.js + TypeScript'
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.title).toBe('Learn Node.js + TypeScript');
    expect(createResponse.body.status).toBe('todo');

    const listResponse = await request(app).get('/todos');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.total).toBe(1);
    expect(listResponse.body.items).toHaveLength(1);
  });

  it('updates todo status and title', async () => {
    const app = createApp();

    const createResponse = await request(app).post('/todos').send({ title: 'Task 1' });

    const updateStatusResponse = await request(app)
      .patch(`/todos/${createResponse.body.id}/status`)
      .send({ status: 'done' });

    expect(updateStatusResponse.status).toBe(200);
    expect(updateStatusResponse.body.status).toBe('done');

    const updateTitleResponse = await request(app)
      .patch(`/todos/${createResponse.body.id}/title`)
      .send({ title: 'Updated task title' });

    expect(updateTitleResponse.status).toBe(200);
    expect(updateTitleResponse.body.title).toBe('Updated task title');
  });

  it('filters and paginates todos', async () => {
    const app = createApp();

    await request(app).post('/todos').send({ title: 'Learn Typescript basics' });
    const apiTodo = await request(app).post('/todos').send({ title: 'Build API project' });

    await request(app).patch(`/todos/${apiTodo.body.id}/status`).send({ status: 'done' });

    const filteredResponse = await request(app).get('/todos').query({
      status: 'done',
      search: 'api',
      limit: 10,
      offset: 0
    });

    expect(filteredResponse.status).toBe(200);
    expect(filteredResponse.body.total).toBe(1);
    expect(filteredResponse.body.items).toHaveLength(1);
    expect(filteredResponse.body.items[0].status).toBe('done');
  });

  it('deletes todo and updates stats', async () => {
    const app = createApp();

    const createResponse = await request(app).post('/todos').send({ title: 'Task for delete' });

    const deleteResponse = await request(app).delete(`/todos/${createResponse.body.id}`);
    expect(deleteResponse.status).toBe(204);

    const statsResponse = await request(app).get('/todos/stats');
    expect(statsResponse.status).toBe(200);
    expect(statsResponse.body.total).toBe(0);
    expect(statsResponse.body.byStatus.todo).toBe(0);
  });

  it('returns 400 for invalid title', async () => {
    const app = createApp();

    const createResponse = await request(app).post('/todos').send({
      title: 'Hi'
    });

    expect(createResponse.status).toBe(400);
  });
});
