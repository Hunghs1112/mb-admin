import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.users}`);
      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        setUsers([]);
        console.error('Lỗi từ server:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách người dùng:', error);
      setUsers([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Quản lý Người dùng</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Tên</th>
              <th className="py-2 px-4 text-left">Tài khoản</th>
              <th className="py-2 px-4 text-left">Số tài khoản</th>
              <th className="py-2 px-4 text-left">Trạng thái</th>
              <th className="py-2 px-4 text-left">Ngày kích hoạt</th>
              <th className="py-2 px-4 text-left">Ngày hết hạn</th>
              <th className="py-2 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{user.name || 'Chưa có tên'}</td>
                <td className="py-2 px-4">{user.username || 'Chưa có tài khoản'}</td>
                <td className="py-2 px-4">{user.account_number || 'Chưa có số tài khoản'}</td>
                <td className="py-2 px-4">{user.locked ? 'Khóa' : 'Mở'}</td>
                <td className="py-2 px-4">{user.activation_date ? new Date(user.activation_date).toLocaleDateString() : 'Chưa kích hoạt'}</td>
                <td className="py-2 px-4">{user.expiration_date ? new Date(user.expiration_date).toLocaleDateString() : 'Chưa có'}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => navigate(`/user/${user.account_number}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                    disabled={!user.account_number}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && <p className="text-center text-gray-500 mt-4">Không có người dùng nào.</p>}
    </div>
  );
}

export default Home;