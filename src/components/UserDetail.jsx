
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

function UserDetail() {
  const { account_number } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    new_account_number: '',
    status: 'Đã khóa',
    new_expiration_date: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [account_number]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.userDetail}/${account_number}`);
      if (!response.data || !response.data.success || !response.data.user) {
        throw new Error('Invalid API response');
      }
      const userData = response.data.user;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        username: userData.username || '',
        new_account_number: userData.account_number || '',
        status: userData.locked ? 'Đã khóa' : 'Đã kích hoạt',
        new_expiration_date: userData.expiration_date 
          ? new Date(userData.expiration_date).toISOString().split('T')[0] 
          : '',
      });
    } catch (error) {
      console.error('Lỗi tải thông tin người dùng:', error);
      alert(error.response?.data?.message || 'Lỗi khi tải thông tin người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validate expiration date if status is "Đã kích hoạt"
    if (formData.status === 'Đã kích hoạt') {
      const newExpDate = new Date(formData.new_expiration_date);
      if (!formData.new_expiration_date || newExpDate <= new Date()) {
        alert('Ngày hết hạn phải là ngày trong tương lai!');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Update user info (name and account number)
      await axios.put(`${API_BASE_URL}${API_ENDPOINTS.account}/${account_number}`, {
        name: formData.name,
        new_account_number: formData.new_account_number,
      });

      // Update lock status and expiration date
      if (formData.status === 'Đã kích hoạt') {
        const activationDate = new Date().toISOString().split('T')[0];
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.lockStatus}/${account_number}`, {
          locked: false,
          activation_date: activationDate,
          expiration_date: formData.new_expiration_date,
        });
      } else {
        // Lock the account
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.lockStatus}/${account_number}`, {
          locked: true,
          activation_date: null,
          expiration_date: null,
        });
      }

      alert('Cập nhật thông tin thành công!');
      fetchUser();
    } catch (error) {
      console.error('Lỗi cập nhật thông tin:', error);
      alert(error.response?.data?.message || 'Lỗi khi cập nhật thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      setIsSubmitting(true);
      try {
        await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.deleteUser}/${account_number}`);
        alert('Tài khoản đã được xóa!');
        navigate('/home');
      } catch (error) {
        console.error('Lỗi xóa tài khoản:', error);
        alert(error.response?.data?.message || 'Lỗi khi xóa tài khoản.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) return (
    <div className="text-center">
      <p className="text-gray-500">Đang tải...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết Người dùng</h2>
      {user ? (
        <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tài khoản:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Số tài khoản:</label>
              <input
                type="text"
                name="new_account_number"
                value={formData.new_account_number}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trạng thái:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
              >
                <option value="Đã kích hoạt">Đã kích hoạt</option>
                <option value="Đã khóa">Đã khóa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày kích hoạt:</label>
              <input
                type="text"
                value={user.activation_date ? new Date(user.activation_date).toLocaleDateString() : 'Chưa kích hoạt'}
                className="mt-1 block w-full p-2 border rounded"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày hết hạn:</label>
              <input
                type="date"
                name="new_expiration_date"
                value={formData.new_expiration_date}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
                required={formData.status === 'Đã kích hoạt'}
                disabled={formData.status === 'Đã khóa'}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={isSubmitting}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Người dùng không tồn tại.</p>
      )}
    </div>
  );
}

export default UserDetail;
