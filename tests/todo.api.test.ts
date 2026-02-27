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
    expect(listResponse.body).toHaveLength(1);
  });

  it('updates todo status', async () => {
    const app = createApp();

    const createResponse = await request(app).post('/todos').send({ title: 'Task 1' });

    const updateResponse = await request(app)
      .patch(`/todos/${createResponse.body.id}/status`)
      .send({ status: 'done' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('done');
  });

  it('returns 400 for invalid title', async () => {
    const app = createApp();

    const createResponse = await request(app).post('/todos').send({
      title: 'Hi'
    });

    expect(createResponse.status).toBe(400);
  });
});
