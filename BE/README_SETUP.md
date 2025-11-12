# Hướng Dẫn Setup MongoDB Local - Database "bookora"

## 📋 Tổng Quan

Hệ thống đã được cấu hình để sử dụng MongoDB Local thay vì MongoDB Atlas. Database name: **`bookora`**

## 🚀 Các Bước Setup

### Bước 1: Tạo file .env

**Cách 1: Sử dụng PowerShell Script (Khuyến nghị)**
```powershell
cd BE
.\create-env.ps1
```

**Cách 2: Tạo thủ công**
Tạo file `.env` trong thư mục `BE` với nội dung:

```env
PORT=8888
DB_URI=mongodb://localhost:27017/bookora
JWT_SECRET=bookora_jwt_secret_key_2025_change_in_production
JWT_REFRESH_SECRET=bookora_refresh_secret_key_2025_change_in_production
NODE_ENV=development
SUB_CATEGORY_DEFAULT=default
CATEGOGY_DEFAULT=default
EMAIL_USERNAME=
EMAIL_PASSWORD=
RESET_PASSWORD_SECRET=reset_secret_2025
RESET_PASSWORD_EXPIRES=3600000
FRONTEND_URL=http://localhost:5173
```

### Bước 2: Khởi động MongoDB

**Windows:**
- Mở Services (Win + R → `services.msc`)
- Tìm "MongoDB" và Start service
- Hoặc chạy: `net start MongoDB`

**Kiểm tra MongoDB đang chạy:**
```bash
mongod --version
```

### Bước 3: Mở MongoDB Compass

1. Mở MongoDB Compass
2. Kết nối: `mongodb://localhost:27017`
3. Click "Connect"

### Bước 4: Tạo Database "bookora"

1. Click **"+"** hoặc **"Create Database"**
2. **Database Name:** `bookora`
3. **Collection Name:** `products`
4. Click **"Create Database"**

### Bước 5: Import Dữ Liệu Mẫu

**Cách 1: Import từ file (Dễ nhất)**
1. Chọn database `bookora` → collection `products`
2. Click **"ADD DATA"** → **"Import File"**
3. Chọn file `sample-data.json` trong thư mục `BE`
4. Format: **JSON**
5. Click **"Import"**

**Cách 2: Sử dụng MongoDB Shell**
```bash
cd BE
mongoimport --db bookora --collection products --file sample-data.json --jsonArray
```

Xem chi tiết trong file: `IMPORT_MONGODB_COMPASS.md`

### Bước 6: Khởi động Backend

```bash
cd BE
npm install
npm run dev
```

Bạn sẽ thấy:
```
Connected MongoDB: mongodb://localhost:27017/bookora
Server is running on: http://localhost:8888/api
```

### Bước 7: Test API

- **GET** `http://localhost:8888/api/products` - Lấy tất cả sản phẩm
- **GET** `http://localhost:8888/api/products/{id}` - Lấy sản phẩm theo ID

## 📦 Dữ Liệu Mẫu

File `sample-data.json` chứa **6 sản phẩm** với đầy đủ:
- ✅ Nhiều ảnh (2-4 ảnh mỗi sản phẩm)
- ✅ Discount percent (10-25%)
- ✅ Rating (4.2-4.8)
- ✅ Reviews (2-4 reviews mỗi sản phẩm)
- ✅ Thông tin chi tiết: publisher, releaseDate, language, pages, age, dimensions

## 🔍 Kiểm Tra

1. **MongoDB Compass:**
   - Database: `bookora`
   - Collection: `products`
   - Số documents: 6

2. **Backend:**
   - Kết nối thành công với MongoDB
   - API trả về dữ liệu từ database

3. **Frontend:**
   - Hiển thị nhiều ảnh
   - Hiển thị discount từ database
   - Hiển thị rating và reviews từ database
   - Hiển thị thông tin chi tiết từ database

## ⚠️ Lưu Ý

- Database name **PHẢI** là `bookora` (theo yêu cầu)
- Collection name **PHẢI** là `products` (theo model)
- Đảm bảo MongoDB đang chạy trước khi start backend
- File `.env` đã được cấu hình sẵn với `DB_URI=mongodb://localhost:27017/bookora`

## 🐛 Troubleshooting

Xem file `HUONG_DAN_IMPORT.md` hoặc `IMPORT_MONGODB_COMPASS.md` để biết cách xử lý lỗi.

## 📚 Tài Liệu Tham Khảo

- `README_DATABASE.md` - Thông tin về cấu trúc database
- `HUONG_DAN_IMPORT.md` - Hướng dẫn import chi tiết
- `IMPORT_MONGODB_COMPASS.md` - Hướng dẫn import trong MongoDB Compass

