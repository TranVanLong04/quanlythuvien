<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" alt="React" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NodeJS-Dark.svg" alt="Node.js" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/MySQL-Dark.svg" alt="MySQL" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" alt="Tailwind CSS" width="40" height="40"/>
  
  <h1 align="center">Hệ thống Quản lý Thư viện (Library Management System)</h1>
</div>

Một ứng dụng web toàn diện được thiết kế để số hóa và tối ưu hóa quy trình quản lý của một thư viện thực tế. Dự án cung cấp một nền tảng thân thiện, cho phép thủ thư quản lý sách, theo dõi lịch sử mượn/trả và sinh viên có thể tìm kiếm, đặt lịch mượn sách trực tuyến một cách dễ dàng.

---

## 🌟 Chức năng nổi bật

### Dành cho Người đọc (Sinh viên)
- **Tài khoản cá nhân:** Đăng ký, đăng nhập (hỗ trợ cả Email/Password truyền thống và Google OAuth), đổi mật khẩu.
- **Tìm kiếm sách:** Xem danh sách toàn bộ sách, tìm kiếm sách theo tên, tác giả, nhà xuất bản, thể loại.
- **Mượn & Trả sách:** Đặt lịch mượn sách ngay trên website. Gửi yêu cầu trả sách. Xem lịch sử mượn trả cá nhân.
- **Thông báo:** Nhận thông báo (chuông) khi yêu cầu mượn/trả sách được duyệt hoặc khi sắp đến hạn trả sách.

### Dành cho Thủ thư (Quản trị viên)
- **Quản lý Kho sách:** Xem, Thêm mới, Chỉnh sửa, và Xóa các đầu sách (bao gồm cả upload ảnh bìa). Theo dõi số lượng tồn kho (stock).
- **Quản lý Mượn / Trả:** Xem danh sách tất cả các yêu cầu mượn, thao tác: Duyệt đơn (Approve), Từ chối đơn, Xác nhận sinh viên đã nhận sách, Xác nhận sinh viên đã trả sách.
- **Quản lý Thẻ (MSSV):** Sinh viên gửi yêu cầu cập nhật MSSV, thủ thư có quyền duyệt cấp thẻ thư viện.
- **Thống kê & Báo cáo:** Dashboard thống kê trực quan (sử dụng Ant Design Charts) về: số lượng sách, số người dùng, trạng thái mượn trả, sách được mượn nhiều nhất, danh sách vi phạm (trễ hạn) và tiền phạt. Có tính năng **Xuất báo cáo** ra Excel, CSV, PDF.
- **Quản lý Người dùng:** Xem danh sách, cập nhật thông tin và phân quyền (user/admin).

---

## 🛠 Công nghệ sử dụng

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS, Ant Design (UI Library)
- **Routing:** React Router DOM v7
- **State Management:** Context API
- **Data Fetching:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JSON Web Tokens (JWT), Bcrypt (Mã hóa mật khẩu)
- **File Storage:** Multer (Upload cục bộ)

---

## 📂 Cấu trúc dự án (Folder Structure)

Dự án được chia thành hai phần độc lập `client` và `server`.

```text
QuanLyThuVien/
├── client/                 # Mã nguồn Frontend (ReactJS)
│   ├── public/             # File tĩnh công khai
│   ├── src/
│   │   ├── assets/         # Tài nguyên tĩnh (Hình ảnh)
│   │   ├── components/     # UI Component tái sử dụng (Header, Footer, Modal...)
│   │   ├── config/         # Cấu hình API, Axios
│   │   ├── pages/          # Các trang chính (Home, Admin Dashboard, Info...)
│   │   ├── routes/         # Khai báo định tuyến
│   │   └── store/          # Context API quản lý state
│   └── package.json        
└── server/                 # Mã nguồn Backend (Node.js)
    ├── src/
    │   ├── auth/           # Middleware phân quyền & bảo vệ Route
    │   ├── config/         # Cấu hình kết nối MySQL DB
    │   ├── controllers/    # API Controllers xử lý logic chính
    │   ├── models/         # Định nghĩa cấu trúc bảng bằng Sequelize
    │   ├── routes/         # Định nghĩa các HTTP Endpoints
    │   ├── services/       # Xử lý Token, Gửi Email, OTP...
    │   ├── uploads/        # Nơi lưu trữ ảnh upload
    │   └── server.js       # File Entry Point của Backend
    └── package.json        
```

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Local)

Làm theo các bước sau để thiết lập dự án trên máy cá nhân của bạn.

### Yêu cầu cài đặt trước (Prerequisites)
- [Node.js](https://nodejs.org/en/) (phiên bản v20.x LTS trở lên)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (phiên bản 8.x) và công cụ quản lý (ví dụ: MySQL Workbench, XAMPP).
- [Git](https://git-scm.com/)

---

### Bước 1: Clone dự án và cấu hình Cơ sở dữ liệu
1. Mở Terminal và clone kho lưu trữ:
   ```bash
   git clone <your-repo-url>
   cd QuanLyThuVien
   ```
2. Mở công cụ quản lý MySQL, tạo một cơ sở dữ liệu trống có tên `books`:
   ```sql
   CREATE DATABASE books CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   *(Hệ thống sẽ tự động tạo các bảng qua Sequelize khi chạy Server)*

---

### Bước 2: Thiết lập Backend (Server)
1. Mở một terminal mới, di chuyển vào thư mục `server` và cài thư viện:
   ```bash
   cd server
   npm install
   ```
2. Tạo file `.env` ở **thư mục gốc của `server/`** với nội dung:
   ```env
   # --- SECURITY ---
   SECRET_CRYPTO="123456"
   JWT_SECRET="123456"

   # --- CLIENT URL ---
   URL_CLIENT="http://localhost:5173"

   # --- DATABASE MYSQL ---
   DB_HOST="localhost"
   DB_USER="root"
   DB_PASSWORD="your_mysql_password" # Thay bằng mật khẩu MySQL của bạn
   DB_NAME="books"
   MYSQL_PORT="3306"

   # --- EMAIL CONFIG (Dùng cho quên mật khẩu) ---
   USER_EMAIL="your-email@gmail.com"
   EMAIL_PASSWORD="your-app-password" # Mật khẩu ứng dụng của Gmail

   # --- GOOGLE OAUTH ---
   CLIENT_ID="your_google_client_id"
   CLIENT_SECRET="your_google_client_secret"
   REDIRECT_URI="https://developers.google.com/oauthplayground"
   REFRESH_TOKEN="your_refresh_token"
   ```
3. Khởi chạy Server:
   ```bash
   npm run dev
   ```
   *Terminal hiển thị `Server is running on port 3000` là thành công.*

---

### Bước 3: Thiết lập Frontend (Client)
1. Mở một terminal mới, di chuyển vào thư mục `client` và cài thư viện:
   ```bash
   cd client
   npm install
   ```
2. Tạo file `.env` ở **thư mục gốc của `client/`** với nội dung:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_API_URL_IMAGE=http://localhost:3000
   VITE_SECRET_CRYPTO="123456"
   ```
3. Khởi chạy Frontend:
   ```bash
   npm run dev
   ```
4. Mở trình duyệt và truy cập: [http://localhost:5173](http://localhost:5173).

---

## 👑 Tài khoản Quản trị viên (Admin)
Để có thể đăng nhập vào giao diện Admin (Dashboard) quản lý thư viện:
1. Truy cập Website và **Đăng ký** một tài khoản người dùng bình thường.
2. Mở cơ sở dữ liệu `books` (qua MySQL Workbench / phpMyAdmin).
3. Mở bảng `users`, tìm bản ghi của tài khoản vừa tạo.
4. Chỉnh sửa cột `role` từ `user` thành `admin`.
5. Tải lại trang web và đăng nhập lại, bạn sẽ thấy giao diện Admin Dashboard.

---

## 📜 Giấy phép (License)
Dự án được tạo cho mục đích học tập và xây dựng hệ thống quản lý thư viện thực tế. Các nội dung mã nguồn mở được cấp phép tự do.
