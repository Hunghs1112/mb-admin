# API Cập Nhật Trạng Thái Giới Hạn (Limited Status)

## 📋 Tổng quan

API này cho phép cập nhật trạng thái giới hạn (`limited`) của tài khoản người dùng trong hệ thống ngân hàng.

---

## 🔧 Thông tin Endpoint

### **Cập nhật trạng thái Limited**

```
PUT /users/:account_number/limited
```

**Mô tả:** Cập nhật trạng thái giới hạn của tài khoản người dùng (bật/tắt)

---

## 📥 Request

### **URL Parameters**

| Tên | Kiểu dữ liệu | Bắt buộc | Mô tả |
|-----|--------------|----------|-------|
| `account_number` | String | ✅ | Số tài khoản người dùng cần cập nhật |

### **Request Body**

```json
{
  "limited": 0 | 1 | true | false
}
```

| Field | Kiểu dữ liệu | Bắt buộc | Giá trị hợp lệ | Mô tả |
|-------|--------------|----------|----------------|-------|
| `limited` | Number/Boolean | ✅ | `0`, `1`, `true`, `false` | Trạng thái giới hạn:<br/>- `0` hoặc `false`: Tắt giới hạn<br/>- `1` hoặc `true`: Bật giới hạn |

### **Request Headers**

```
Content-Type: application/json
```

### **Ví dụ Request**

**Bật giới hạn:**
```bash
curl -X PUT http://localhost:3000/users/686868686/limited \
  -H "Content-Type: application/json" \
  -d '{"limited": 1}'
```

**Tắt giới hạn:**
```bash
curl -X PUT http://localhost:3000/users/686868686/limited \
  -H "Content-Type: application/json" \
  -d '{"limited": 0}'
```

---

## 📤 Response

### ✅ **Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Trạng thái giới hạn đã được bật!",
  "limited": 1
}
```

| Field | Kiểu dữ liệu | Mô tả |
|-------|--------------|-------|
| `success` | Boolean | Trạng thái thành công |
| `message` | String | Thông báo chi tiết (có thể là "bật" hoặc "tắt") |
| `limited` | Number | Giá trị trạng thái sau khi cập nhật (0 hoặc 1) |

### ❌ **Error Responses**

#### **400 Bad Request - Thiếu số tài khoản**
```json
{
  "success": false,
  "message": "Vui lòng cung cấp số tài khoản!"
}
```

#### **400 Bad Request - Thiếu trạng thái limited**
```json
{
  "success": false,
  "message": "Vui lòng cung cấp trạng thái giới hạn (limited)!"
}
```

#### **400 Bad Request - Giá trị không hợp lệ**
```json
{
  "success": false,
  "message": "Trạng thái giới hạn không hợp lệ! (Chỉ chấp nhận 0 hoặc 1)"
}
```

#### **404 Not Found - Tài khoản không tồn tại**
```json
{
  "success": false,
  "message": "Tài khoản không tồn tại!"
}
```

#### **500 Internal Server Error**
```json
{
  "success": false,
  "message": "Lỗi cập nhật trạng thái giới hạn"
}
```

---

## 💻 Ví dụ Tích hợp

### **JavaScript (Fetch API)**

```javascript
async function updateUserLimitedStatus(accountNumber, isLimited) {
  try {
    const response = await fetch(`/users/${accountNumber}/limited`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limited: isLimited ? 1 : 0
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅', data.message);
      alert(data.message);
      return data;
    } else {
      console.error('❌', data.message);
      alert('Lỗi: ' + data.message);
      return null;
    }
  } catch (error) {
    console.error('Lỗi kết nối:', error);
    alert('Không thể kết nối đến server!');
    return null;
  }
}

// Sử dụng
updateUserLimitedStatus('686868686', true);  // Bật giới hạn
updateUserLimitedStatus('686868686', false); // Tắt giới hạn
```

### **Axios**

```javascript
import axios from 'axios';

const updateUserLimitedStatus = async (accountNumber, isLimited) => {
  try {
    const response = await axios.put(
      `/users/${accountNumber}/limited`,
      { limited: isLimited ? 1 : 0 }
    );

    if (response.data.success) {
      console.log('✅', response.data.message);
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      console.error('❌', error.response.data.message);
      alert(error.response.data.message);
    } else {
      console.error('Lỗi kết nối:', error);
    }
    return null;
  }
};
```

### **jQuery**

```javascript
function updateUserLimitedStatus(accountNumber, isLimited) {
  $.ajax({
    url: `/users/${accountNumber}/limited`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
      limited: isLimited ? 1 : 0
    }),
    success: function(response) {
      if (response.success) {
        console.log('✅', response.message);
        alert(response.message);
      }
    },
    error: function(xhr) {
      const error = xhr.responseJSON;
      console.error('❌', error.message);
      alert('Lỗi: ' + error.message);
    }
  });
}
```

---

## 🎨 Ví dụ Giao diện HTML

### **Toggle Button Component**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quản lý trạng thái giới hạn</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }

    .user-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .user-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .user-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .user-info h3 {
      color: #2c3e50;
      margin-bottom: 5px;
    }

    .user-info p {
      color: #7f8c8d;
      font-size: 14px;
    }

    .status-badge {
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }

    .status-badge.limited {
      background: #fee;
      color: #d63031;
    }

    .status-badge.normal {
      background: #e8f5e9;
      color: #27ae60;
    }

    .user-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 15px;
    }

    .detail-item {
      padding: 10px;
      background: #f8f9fa;
      border-radius: 5px;
    }

    .detail-item label {
      display: block;
      font-size: 12px;
      color: #7f8c8d;
      margin-bottom: 5px;
    }

    .detail-item span {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
    }

    .toggle-btn {
      width: 100%;
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      transition: all 0.3s;
    }

    .toggle-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .toggle-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .toggle-btn.active:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .toggle-btn.inactive {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .toggle-btn.inactive:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
    }

    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏦 Quản lý Trạng thái Giới hạn Tài khoản</h1>
    <div id="users-container">
      <div class="loading">
        <div class="spinner"></div>
        <p>Đang tải danh sách tài khoản...</p>
      </div>
    </div>
  </div>

  <script>
    const API_BASE_URL = ''; // Thay đổi nếu cần

    // Lấy danh sách users
    async function loadUsers() {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const data = await response.json();
        
        if (data.success) {
          displayUsers(data.users);
        } else {
          showError('Không thể tải danh sách tài khoản');
        }
      } catch (error) {
        console.error('Lỗi:', error);
        showError('Lỗi kết nối đến server');
      }
    }

    // Hiển thị users
    function displayUsers(users) {
      const container = document.getElementById('users-container');
      
      if (users.length === 0) {
        container.innerHTML = '<div class="loading"><p>Không có tài khoản nào</p></div>';
        return;
      }

      container.innerHTML = '';

      users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.id = `user-${user.account_number}`;
        
        userCard.innerHTML = `
          <div class="user-header">
            <div class="user-info">
              <h3>${user.name}</h3>
              <p>@${user.username}</p>
            </div>
            <span class="status-badge ${user.limited ? 'limited' : 'normal'}">
              ${user.limited ? '🔒 Bị giới hạn' : '✅ Bình thường'}
            </span>
          </div>
          
          <div class="user-details">
            <div class="detail-item">
              <label>Số tài khoản</label>
              <span>${user.account_number}</span>
            </div>
            <div class="detail-item">
              <label>Số dư</label>
              <span>${formatCurrency(user.balance)}</span>
            </div>
            <div class="detail-item">
              <label>Trạng thái khóa</label>
              <span>${user.locked ? '🔐 Đã khóa' : '🔓 Hoạt động'}</span>
            </div>
          </div>
          
          <button 
            class="toggle-btn ${user.limited ? 'active' : 'inactive'}" 
            onclick="toggleLimited('${user.account_number}', ${user.limited})"
          >
            ${user.limited ? '🔓 Bỏ giới hạn tài khoản' : '🔒 Giới hạn tài khoản'}
          </button>
        `;
        
        container.appendChild(userCard);
      });
    }

    // Format currency VND
    function formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    }

    // Toggle trạng thái limited
    async function toggleLimited(accountNumber, currentStatus) {
      const newStatus = currentStatus ? 0 : 1;
      const button = document.querySelector(`#user-${accountNumber} .toggle-btn`);
      
      // Disable button khi đang xử lý
      button.disabled = true;
      button.textContent = '⏳ Đang xử lý...';
      
      try {
        const response = await fetch(`${API_BASE_URL}/users/${accountNumber}/limited`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ limited: newStatus })
        });

        const data = await response.json();
        
        if (data.success) {
          // Hiển thị thông báo thành công
          showNotification(data.message, 'success');
          
          // Reload danh sách để cập nhật UI
          setTimeout(() => {
            loadUsers();
          }, 500);
        } else {
          showNotification('Lỗi: ' + data.message, 'error');
          button.disabled = false;
          button.textContent = currentStatus ? '🔓 Bỏ giới hạn' : '🔒 Giới hạn tài khoản';
        }
      } catch (error) {
        console.error('Lỗi:', error);
        showNotification('Không thể kết nối đến server', 'error');
        button.disabled = false;
        button.textContent = currentStatus ? '🔓 Bỏ giới hạn' : '🔒 Giới hạn tài khoản';
      }
    }

    // Hiển thị thông báo
    function showNotification(message, type = 'info') {
      alert(message); // Có thể thay bằng toast notification đẹp hơn
    }

    // Hiển thị lỗi
    function showError(message) {
      const container = document.getElementById('users-container');
      container.innerHTML = `
        <div class="loading">
          <p style="color: #e74c3c;">❌ ${message}</p>
          <button onclick="loadUsers()" style="margin-top: 15px; padding: 10px 20px; cursor: pointer;">
            🔄 Thử lại
          </button>
        </div>
      `;
    }

    // Load users khi trang được tải
    loadUsers();
  </script>
</body>
</html>
```

---

## ⚛️ React Component

### **UserLimitedToggle.jsx**

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserLimitedToggle.css';

const UserLimitedToggle = ({ user, onUpdate }) => {
  const [limited, setLimited] = useState(user.limited);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLimited(user.limited);
  }, [user.limited]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `/users/${user.account_number}/limited`,
        { limited: limited ? 0 : 1 }
      );

      if (response.data.success) {
        setLimited(response.data.limited);
        alert(response.data.message);
        
        // Callback để parent component cập nhật
        if (onUpdate) {
          onUpdate(user.account_number, response.data.limited);
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Không thể kết nối';
      alert('Lỗi: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-limited-toggle">
      <div className="user-card">
        <div className="user-header">
          <div className="user-info">
            <h3>{user.name}</h3>
            <p className="username">@{user.username}</p>
            <p className="account-number">STK: {user.account_number}</p>
          </div>
          <span className={`status-badge ${limited ? 'limited' : 'normal'}`}>
            {limited ? '🔒 Bị giới hạn' : '✅ Bình thường'}
          </span>
        </div>

        <div className="user-details">
          <div className="detail-item">
            <label>Số dư</label>
            <span>{user.balance.toLocaleString('vi-VN')} VNĐ</span>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`toggle-btn ${limited ? 'limited-active' : 'limited-inactive'}`}
        >
          {loading ? (
            <span>⏳ Đang xử lý...</span>
          ) : (
            <span>{limited ? '🔓 Bỏ giới hạn' : '🔒 Giới hạn tài khoản'}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserLimitedToggle;
```

### **UserLimitedToggle.css**

```css
.user-limited-toggle {
  margin: 15px 0;
}

.user-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.user-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.user-info p {
  margin: 3px 0;
  color: #7f8c8d;
  font-size: 14px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.limited {
  background: #fee;
  color: #d63031;
}

.status-badge.normal {
  background: #e8f5e9;
  color: #27ae60;
}

.user-details {
  margin: 15px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
}

.detail-item label {
  display: block;
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 3px;
}

.detail-item span {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.toggle-btn {
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;
  color: white;
}

.toggle-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-btn.limited-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toggle-btn.limited-active:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.toggle-btn.limited-inactive {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.toggle-btn.limited-inactive:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
}
```

### **Sử dụng Component**

```jsx
import React, { useState, useEffect } from 'react';
import UserLimitedToggle from './components/UserLimitedToggle';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get('/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Lỗi tải users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = (accountNumber, newLimitedStatus) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.account_number === accountNumber
          ? { ...user, limited: newLimitedStatus }
          : user
      )
    );
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="App">
      <h1>Quản lý Trạng thái Giới hạn</h1>
      {users.map(user => (
        <UserLimitedToggle
          key={user.account_number}
          user={user}
          onUpdate={handleUserUpdate}
        />
      ))}
    </div>
  );
}

export default App;
```

---

## 🔐 Bảo mật

### **Khuyến nghị**

1. **Authentication**: Thêm middleware xác thực token/session
2. **Authorization**: Kiểm tra quyền admin trước khi cho phép cập nhật
3. **Rate Limiting**: Giới hạn số lượng request để tránh abuse
4. **Audit Log**: Ghi lại lịch sử thay đổi trạng thái limited
5. **Input Validation**: Đã được implement trong controller

### **Ví dụ thêm Middleware xác thực**

```javascript
// middleware/auth.js
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập!'
    });
  }

  // Verify token và kiểm tra role admin
  // ... logic xác thực
  
  next();
};

// routes/userRoutes.js
router.put('/users/:account_number/limited', verifyAdmin, userController.updateLimitedStatus);
```

---

## 📊 Các API liên quan

### **Lấy danh sách users (bao gồm trạng thái limited)**

```
GET /users
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "name": "Nguyễn Văn A",
      "username": "nguyenvana",
      "balance": 1000000,
      "account_number": "686868686",
      "locked": 0,
      "limited": 1,
      "activation_date": "2025-01-01",
      "expiration_date": "2025-12-31",
      "image": "/uploads/avatar.jpg"
    }
  ]
}
```

### **Lấy thông tin chi tiết user**

```
GET /user/:account_number
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "username": "nguyenvana",
    "balance": 1000000,
    "account_number": "686868686",
    "locked": 0,
    "limited": 1,
    "activation_date": "2025-01-01",
    "expiration_date": "2025-12-31",
    "image": "/uploads/avatar.jpg"
  }
}
```

---

## 🧪 Testing

### **Test Cases**

```javascript
describe('PUT /users/:account_number/limited', () => {
  
  it('Nên cập nhật limited thành 1', async () => {
    const response = await request(app)
      .put('/users/686868686/limited')
      .send({ limited: 1 });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.limited).toBe(1);
  });

  it('Nên cập nhật limited thành 0', async () => {
    const response = await request(app)
      .put('/users/686868686/limited')
      .send({ limited: 0 });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.limited).toBe(0);
  });

  it('Nên trả về lỗi khi thiếu limited', async () => {
    const response = await request(app)
      .put('/users/686868686/limited')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('Nên trả về lỗi khi account không tồn tại', async () => {
    const response = await request(app)
      .put('/users/999999999/limited')
      .send({ limited: 1 });
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

});
```

---

## 📝 Changelog

### Version 1.0.0 (23/10/2025)
- ✅ Tạo API cập nhật trạng thái limited
- ✅ Thêm validation cho input
- ✅ Thêm transaction handling
- ✅ Cập nhật GET /users và GET /user/:account_number để trả về field limited

---

## 📞 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.

---

## 📄 License

© 2025 - Bank System API Documentation

