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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h1>
          <p className="text-sm text-slate-600 mt-1">Tổng số: {users.length} người dùng</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tên</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tài khoản</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Số TK</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Giới hạn</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Kích hoạt</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Hết hạn</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-900">{user.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{user.username || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-700">{user.account_number || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.locked 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {user.locked ? 'Khóa' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.limited 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {user.limited ? 'Giới hạn' : 'Bình thường'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {user.activation_date ? new Date(user.activation_date).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {user.expiration_date ? new Date(user.expiration_date).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/user/${user.account_number}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Không có người dùng nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
