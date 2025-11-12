# Hướng dẫn Import Dữ Liệu vào MongoDB Compass - Database "bookora"

## Bước 1: Kiểm tra MongoDB đang chạy

1. Mở MongoDB Compass
2. Kết nối với: `mongodb://localhost:27017`
3. Click "Connect"

## Bước 2: Tạo Database "bookora"

1. Trong MongoDB Compass, click nút **"+"** hoặc **"Create Database"**
2. **Database Name:** `bookora`
3. **Collection Name:** `products`
4. Click **"Create Database"**

## Bước 3: Import Dữ Liệu Mẫu

### Cách 1: Import từ file JSON (Dễ nhất)

1. Trong MongoDB Compass, chọn database **`bookora`**
2. Chọn collection **`products`**
3. Click nút **"ADD DATA"** → **"Import File"**
4. Chọn file **`sample-data.json`** trong thư mục `BE`
5. Chọn format: **JSON**
6. Click **"Import"**

### Cách 2: Import thủ công (Nếu cách 1 không hoạt động)

1. Mở file `sample-data.json` trong thư mục `BE`
2. Copy từng object JSON (mỗi sản phẩm)
3. Trong MongoDB Compass:
   - Chọn collection `products`
   - Click **"INSERT DOCUMENT"**
   - Chọn **"{}"** (JSON mode)
   - Paste JSON object
   - Click **"Insert"**
4. Lặp lại cho từng sản phẩm (có 6 sản phẩm)

### Cách 3: Sử dụng MongoDB Shell

Mở Command Prompt hoặc PowerShell và chạy:

```bash
cd BE
mongoimport --db bookora --collection products --file sample-data.json --jsonArray
```

**Lưu ý:** Cần cài đặt MongoDB Database Tools để sử dụng mongoimport.

## Bước 4: Kiểm tra Dữ Liệu

1. Trong MongoDB Compass, chọn database **`bookora`**
2. Chọn collection **`products`**
3. Bạn sẽ thấy **6 sản phẩm** đã được import
4. Click vào từng document để xem chi tiết:
   - Có nhiều ảnh trong mảng `images`
   - Có `discountPercent`, `rating`, `reviews`
   - Có thông tin chi tiết: `publisher`, `releaseDate`, `language`, `pages`, `age`, `dimensions`

## Bước 5: Khởi động Backend

1. Mở Terminal trong thư mục `BE`
2. Chạy lệnh:
   ```bash
   npm install
   npm run dev
   ```
3. Backend sẽ kết nối với MongoDB và chạy trên `http://localhost:8888`
4. Bạn sẽ thấy thông báo: `Connected MongoDB: mongodb://localhost:27017/bookora`

## Bước 6: Test API

Mở trình duyệt hoặc Postman:

- **GET** `http://localhost:8888/api/products` - Lấy tất cả sản phẩm
- **GET** `http://localhost:8888/api/products/{id}` - Lấy sản phẩm theo ID

## Cấu trúc Dữ Liệu Mẫu

Mỗi sản phẩm có:
- ✅ **images**: Mảng nhiều ảnh (2-4 ảnh)
- ✅ **discountPercent**: Phần trăm giảm giá (10-25%)
- ✅ **rating**: Đánh giá trung bình (4.2-4.8)
- ✅ **reviews**: Mảng đánh giá với userName, rating, comment
- ✅ **publisher**: Nhà xuất bản
- ✅ **releaseDate**: Ngày phát hành
- ✅ **language**: Ngôn ngữ
- ✅ **pages**: Số trang
- ✅ **age**: Độ tuổi
- ✅ **dimensions**: Kích thước

## Troubleshooting

### Lỗi: "Cannot connect to MongoDB"
- Kiểm tra MongoDB service đang chạy
- Mở Services (services.msc) và tìm "MongoDB", Start nếu cần
- Hoặc chạy: `net start MongoDB`

### Lỗi: "Database not found"
- Tạo database `bookora` trong MongoDB Compass trước
- Hoặc MongoDB sẽ tự tạo khi có dữ liệu đầu tiên

### Lỗi: "Collection not found"
- Tạo collection `products` trong database `bookora`
- Hoặc import dữ liệu sẽ tự tạo collection

### Lỗi: "Import failed"
- Kiểm tra file `sample-data.json` có đúng format JSON không
- Thử import từng object một (Cách 2)
- Hoặc sử dụng MongoDB Shell (Cách 3)

## Lưu ý Quan Trọng

⚠️ **Database name phải là `bookora`** (theo yêu cầu của bạn)
⚠️ **Collection name phải là `products`** (theo model Product)
⚠️ File `.env` đã được tạo sẵn với `DB_URI=mongodb://localhost:27017/bookora`

