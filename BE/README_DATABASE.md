# Hướng dẫn kết nối MongoDB Local

## Yêu cầu
1. Cài đặt MongoDB trên máy tính của bạn
2. Cài đặt MongoDB Compass (GUI tool để quản lý database)

## Cấu hình kết nối

### 1. Tạo file .env trong thư mục BE

Tạo file `.env` với nội dung sau:

```env
PORT=8888
DB_URI=mongodb://localhost:27017/bookora
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
NODE_ENV=development
SUB_CATEGORY_DEFAULT=default
CATEGOGY_DEFAULT=default
EMAIL_USERNAME=your_email@example.com
EMAIL_PASSWORD=your_email_password
RESET_PASSWORD_SECRET=your_reset_password_secret
RESET_PASSWORD_EXPIRES=3600000
FRONTEND_URL=http://localhost:5173
```

### 2. Khởi động MongoDB

Đảm bảo MongoDB service đang chạy trên máy của bạn:
- Windows: MongoDB thường chạy tự động sau khi cài đặt
- Nếu chưa chạy, mở Command Prompt và chạy: `mongod`

### 3. Kết nối với MongoDB Compass

1. Mở MongoDB Compass
2. Kết nối với: `mongodb://localhost:27017`
3. Tạo database mới tên `bookora` (hoặc sử dụng database đã có)

### 4. Cấu trúc Product mới

Product model đã được cập nhật với các trường mới:

- `images`: Array of strings - Danh sách nhiều ảnh
- `discountPercent`: Number (0-100) - Phần trăm giảm giá
- `rating`: Number (0-5) - Đánh giá trung bình
- `reviews`: Array of review objects - Danh sách đánh giá
  - `userId`: ObjectId - ID người dùng
  - `userName`: String - Tên người dùng
  - `userAvatar`: String - Avatar người dùng
  - `rating`: Number (1-5) - Số sao
  - `comment`: String - Nội dung đánh giá
  - `createdAt`: Date - Ngày tạo
- `publisher`: String - Nhà xuất bản
- `releaseDate`: Date - Ngày phát hành
- `language`: String - Ngôn ngữ
- `pages`: Number - Số trang
- `age`: String - Độ tuổi
- `dimensions`: String - Kích thước

### 5. Ví dụ dữ liệu Product

```json
{
  "name": "Sách hay",
  "price": 200000,
  "category": "Tiểu thuyết",
  "imageUrl": "https://example.com/image1.jpg",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ],
  "stock": 50,
  "status": "Sẵn",
  "discountPercent": 15,
  "rating": 4.5,
  "reviews": [
    {
      "userName": "Nguyễn Văn A",
      "userAvatar": "https://example.com/avatar.jpg",
      "rating": 5,
      "comment": "Sách rất hay!",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "publisher": "NXB Trẻ",
  "releaseDate": "2024-01-01",
  "language": "Tiếng Việt",
  "pages": 300,
  "age": "14+",
  "dimensions": "14 × 20 cm"
}
```

### 6. Khởi động Backend

```bash
cd BE
npm install
npm run dev
```

Backend sẽ tự động kết nối với MongoDB local tại `mongodb://localhost:27017/bookora`

