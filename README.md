# Node.js + TypeScript Learning Project (Nâng cấp)

Dự án này giúp bạn **vừa thực hành vừa tự kiểm tra** khi học Node.js + TypeScript thông qua một API Todo theo kiến trúc nhiều tầng.

## 1) Điểm mới sau khi nâng cấp

- Thêm **search/filter/pagination/sort** cho danh sách todo.
- Thêm endpoint **đổi title** và **xóa todo**.
- Thêm endpoint **thống kê** (`/todos/stats`) để theo dõi tiến độ.
- Mở rộng test để bao phủ các luồng mới.

## 2) Mục tiêu học

- Hiểu tách tầng: `route -> service -> repository`.
- Hiểu validate input/query bằng `zod`.
- Hiểu cách thiết kế API có query params thực tế.
- Hiểu cách viết test API để tự check logic mỗi lần refactor.

## 3) Cách chạy nhanh

```bash
npm install
npm run dev
```

Mặc định server chạy tại `http://localhost:3000`.

## 4) Scripts quan trọng

- `npm run dev`: chạy server watch mode (tsx)
- `npm run typecheck`: kiểm tra kiểu TS
- `npm run test`: chạy test Vitest
- `npm run build`: build ra `dist/`
- `npm run check`: chạy `typecheck + test + build`

## 5) API endpoints

### Health
- `GET /health`

### Todo list (có query)
- `GET /todos`
- Query params (optional):
  - `status`: `todo | in_progress | done`
  - `search`: tìm theo title
  - `limit`: 1..100
  - `offset`: >= 0
  - `sortBy`: `createdAt | title`
  - `order`: `asc | desc`

Response mẫu:

```json
{
  "items": [],
  "total": 0
}
```

### Create todo
- `POST /todos`

```json
{ "title": "Learn Node.js + TypeScript" }
```

### Update status
- `PATCH /todos/:id/status`

```json
{ "status": "done" }
```

### Update title
- `PATCH /todos/:id/title`

```json
{ "title": "New title" }
```

### Delete todo
- `DELETE /todos/:id`
- Thành công trả `204 No Content`

### Stats
- `GET /todos/stats`

Response mẫu:

```json
{
  "total": 3,
  "byStatus": {
    "todo": 1,
    "in_progress": 1,
    "done": 1
  }
}
```

## 6) Giải thích luồng xử lý

1. Request vào `routes` để validate.
2. Route gọi `service` xử lý nghiệp vụ.
3. Service gọi `repository` để đọc/ghi dữ liệu in-memory.
4. Kết quả trả ngược lên route -> response JSON.

## 7) Giải thích nhanh từng file

- `src/index.ts`: entrypoint, start server.
- `src/app.ts`: khởi tạo express app + mount routes.
- `src/domain/todo.ts`: kiểu dữ liệu, query model, stats model.
- `src/repositories/todoRepository.ts`: thao tác dữ liệu (list/filter/sort/update/delete/stats).
- `src/services/todoService.ts`: tầng business logic.
- `src/routes/todoRoutes.ts`: HTTP layer + validate body/query.
- `tests/todo.api.test.ts`: integration tests cho các luồng API.

## 8) Gợi ý học tiếp

- Thêm auth đơn giản bằng API key middleware.
- Lưu dữ liệu sang SQLite thay vì in-memory.
- Tách lỗi nghiệp vụ thành custom error class (`NotFoundError`, `ValidationError`).
