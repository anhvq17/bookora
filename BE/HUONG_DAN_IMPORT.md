# Hướng dẫn Import Dữ Liệu Mẫu vào MongoDB Compass

## Bước 1: Tạo file .env

Tạo file `.env` trong thư mục `BE` với nội dung sau:

```env
PORT=8888
DB_URI=mongodb://localhost:27017/bookora
JWT_SECRET=your_jwt_secret_key_here_change_this
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_change_this
NODE_ENV=development
SUB_CATEGORY_DEFAULT=default
CATEGOGY_DEFAULT=default
EMAIL_USERNAME=your_email@example.com
EMAIL_PASSWORD=your_email_password
RESET_PASSWORD_SECRET=your_reset_password_secret
RESET_PASSWORD_EXPIRES=3600000
FRONTEND_URL=http://localhost:5173
```

**Lưu ý:** Thay đổi các giá trị JWT_SECRET và JWT_REFRESH_SECRET thành các chuỗi ngẫu nhiên an toàn.

## Bước 2: Khởi động MongoDB

### Windows:
1. Mở Command Prompt hoặc PowerShell
2. Kiểm tra MongoDB đang chạy:
   ```bash
   mongod --version
   ```
3. Nếu chưa chạy, khởi động MongoDB service:
   - Mở Services (services.msc)
   - Tìm "MongoDB" và Start service
   - Hoặc chạy: `net start MongoDB`

### Mac/Linux:
```bash
# Kiểm tra MongoDB
mongod --version

# Khởi động MongoDB (nếu cần)
sudo systemctl start mongod
# hoặc
brew services start mongodb-community
```

## Bước 3: Mở MongoDB Compass

1. Mở ứng dụng MongoDB Compass
2. Kết nối với: `mongodb://localhost:27017`
3. Click "Connect"

## Bước 4: Tạo Database "bookora"

1. Trong MongoDB Compass, click nút "+" hoặc "Create Database"
2. Database Name: `bookora`
3. Collection Name: `products`
4. Click "Create Database"

## Bước 5: Import Dữ Liệu Mẫu

### Cách 1: Import từ file JSON (Khuyến nghị)

1. Trong MongoDB Compass, chọn database `bookora`
2. Chọn collection `products`
3. Click nút "ADD DATA" → "Import File"
4. Chọn file `sample-data.json` trong thư mục `BE`
5. Chọn format: JSON
6. Click "Import"

### Cách 2: Import thủ công từ file JSON

1. Mở file `sample-data.json` trong thư mục `BE`
2. Copy toàn bộ nội dung
3. Trong MongoDB Compass, chọn collection `products`
4. Click "INSERT DOCUMENT"
5. Chọn "{}" (JSON mode)
6. Paste nội dung JSON (chỉ paste 1 object tại một thời điểm)
7. Click "Insert"
8. Lặp lại cho từng sản phẩm

### Cách 3: Sử dụng MongoDB Shell (mongoimport)

Mở Terminal/Command Prompt và chạy:

```bash
cd BE
mongoimport --db bookora --collection products --file sample-data.json --jsonArray
```

## Bước 6: Kiểm tra Dữ Liệu

1. Trong MongoDB Compass, chọn database `bookora`
2. Chọn collection `products`
3. Bạn sẽ thấy 6 sản phẩm mẫu đã được import
4. Click vào từng document để xem chi tiết

## Bước 7: Khởi động Backend

1. Mở Terminal trong thư mục `BE`
2. Chạy lệnh:
   ```bash
   npm install
   npm run dev
   ```
3. Backend sẽ kết nối với MongoDB và chạy trên `http://localhost:8888`

## Bước 8: Kiểm tra API

Mở trình duyệt hoặc Postman và test:

- GET `http://localhost:8888/api/products` - Lấy tất cả sản phẩm
- GET `http://localhost:8888/api/products/{id}` - Lấy sản phẩm theo ID

## Lưu ý

- Đảm bảo MongoDB đang chạy trước khi khởi động backend
- Nếu gặp lỗi kết nối, kiểm tra lại `DB_URI` trong file `.env`
- Database name phải là `bookora` (theo yêu cầu)
- Collection name phải là `products` (theo model)

## Troubleshooting

### Lỗi: "Cannot connect to MongoDB"
- Kiểm tra MongoDB service đang chạy
- Kiểm tra port 27017 không bị block
- Thử kết nối lại trong MongoDB Compass

### Lỗi: "Database not found"
- Tạo database `bookora` trong MongoDB Compass trước
- Hoặc MongoDB sẽ tự tạo khi có dữ liệu đầu tiên

### Lỗi: "Collection not found"
- Tạo collection `products` trong database `bookora`
- Hoặc import dữ liệu sẽ tự tạo collection

