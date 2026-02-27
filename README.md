# Node.js + TypeScript Learning Project

Dự án này giúp bạn **vừa thực hành vừa tự kiểm tra** khi học Node.js + TypeScript thông qua một API Todo nhỏ.

## 1) Mục tiêu học

- Biết cách tổ chức dự án Node.js theo tầng: `route -> service -> repository`.
- Biết cấu hình TypeScript cho môi trường Node.
- Biết viết test API bằng `vitest` + `supertest`.
- Biết chạy bộ lệnh `check` để đảm bảo code ổn định trước khi commit.

## 2) Cách chạy nhanh

```bash
npm install
npm run dev
```

Mặc định server chạy tại `http://localhost:3000`.

## 3) Các script quan trọng

- `npm run dev`: chạy server ở chế độ watch (qua `tsx`).
- `npm run typecheck`: kiểm tra kiểu TypeScript, không build file JS.
- `npm run test`: chạy test tự động bằng Vitest.
- `npm run build`: biên dịch TS sang JS trong thư mục `dist/`.
- `npm run check`: chạy lần lượt `typecheck + test + build`.

> Gợi ý học: mỗi khi sửa code, hãy chạy `npm run check` để biết mình đang sai ở đâu.

## 4) API endpoint

### Health check

- `GET /health`
- Kết quả mẫu:

```json
{ "status": "ok" }
```

### Lấy danh sách todo

- `GET /todos`

### Tạo todo

- `POST /todos`
- Body:

```json
{ "title": "Learn Node.js + TypeScript" }
```

- Điều kiện:
  - `title` tối thiểu 3 ký tự
  - `title` tối đa 120 ký tự

### Cập nhật trạng thái

- `PATCH /todos/:id/status`
- Body:

```json
{ "status": "done" }
```

- `status` chỉ nhận: `todo`, `in_progress`, `done`.

## 5) Giải thích từng file

### `src/index.ts`
Điểm vào chương trình. File này tạo app và `listen` cổng chạy server.

### `src/app.ts`
Khởi tạo Express app, bật JSON parser, đăng ký route `/health` và nhóm route `/todos`.

### `src/domain/todo.ts`
Khai báo type/interface cho dữ liệu Todo. Đây là “hợp đồng dữ liệu” của app.

### `src/repositories/todoRepository.ts`
Tầng lưu trữ dữ liệu (in-memory). Chịu trách nhiệm CRUD cơ bản trên mảng todo.

### `src/services/todoService.ts`
Tầng nghiệp vụ. Nơi xử lý logic như chuẩn hóa title, kiểm tra todo tồn tại trước khi cập nhật.

### `src/routes/todoRoutes.ts`
Tầng HTTP: nhận request, validate body bằng Zod, gọi service, trả response phù hợp.

### `tests/todo.api.test.ts`
Test luồng API end-to-end ở mức app (không cần mở port thật), giúp bạn kiểm tra nhanh khi học.

### `tsconfig.json` / `tsconfig.build.json`
- `tsconfig.json`: dùng chung cho typecheck và test.
- `tsconfig.build.json`: chuyên cho build production từ thư mục `src/`.

### `vitest.config.ts`
Cấu hình Vitest dùng môi trường Node và nhận diện file test trong `tests/**/*.test.ts`.

## 6) Luồng chạy của ứng dụng

1. Client gọi HTTP vào route (`src/routes/todoRoutes.ts`).
2. Route validate input bằng Zod.
3. Route gọi service (`src/services/todoService.ts`).
4. Service xử lý nghiệp vụ rồi gọi repository (`src/repositories/todoRepository.ts`).
5. Repository đọc/ghi dữ liệu in-memory.
6. Kết quả trả ngược lại về route và response cho client.

Luồng này giúp code rõ trách nhiệm, dễ mở rộng và dễ test.

## 7) Gợi ý bài tập tiếp theo

- Thêm endpoint xoá todo.
- Thêm filter theo status (`GET /todos?status=done`).
- Thay in-memory bằng SQLite/PostgreSQL.
- Thêm middleware log request.
