# Script tạo file .env cho MongoDB Local
# Chạy script này trong PowerShell: .\create-env.ps1

$envContent = @"
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
"@

if (Test-Path ".env") {
    Write-Host "File .env da ton tai. Ban co muon ghi de? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "Y" -or $response -eq "y") {
        $envContent | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "File .env da duoc cap nhat!" -ForegroundColor Green
    } else {
        Write-Host "Khong ghi de file .env" -ForegroundColor Red
    }
} else {
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "File .env da duoc tao thanh cong!" -ForegroundColor Green
}

Write-Host "`nDB_URI da duoc cau hinh: mongodb://localhost:27017/bookora" -ForegroundColor Cyan

