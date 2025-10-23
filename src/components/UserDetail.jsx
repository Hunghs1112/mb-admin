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
  const [isTogglingLimited, setIsTogglingLimited] = useState(false);

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

    if (formData.status === 'Đã kích hoạt') {
      const newExpDate = new Date(formData.new_expiration_date);
      const today = new Date();
      if (!formData.new_expiration_date || newExpDate <= today) {
        alert('Ngày hết hạn phải là ngày trong tương lai!');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await axios.put(`${API_BASE_URL}${API_ENDPOINTS.account}/${account_number}`, {
        name: formData.name,
        new_account_number: formData.new_account_number,
      });

      if (formData.status === 'Đã kích hoạt') {
        const today = new Date();
        const expirationDate = new Date(formData.new_expiration_date);
        const timeDiff = expirationDate - today;
        const expirationDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (expirationDays <= 0) {
          alert('Ngày hết hạn phải là ngày trong tương lai!');
          setIsSubmitting(false);
          return;
        }

        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.activateAccount}/${account_number}`, {
          expiration_days: expirationDays,
        });
      } else {
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.activateAccount}/${account_number}`, {
          expiration_days: 0,
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

  const handleToggleLimited = async () => {
    if (isTogglingLimited) return;
    
    const newLimitedStatus = user.limited ? 0 : 1;
    const action = newLimitedStatus ? 'bật giới hạn' : 'bỏ giới hạn';
    
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} cho tài khoản này?`)) {
      return;
    }

    setIsTogglingLimited(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${account_number}/limited`,
        { limited: newLimitedStatus }
      );

      if (response.data.success) {
        alert(response.data.message);
        fetchUser();
      } else {
        alert('Lỗi: ' + response.data.message);
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái giới hạn:', error);
      alert(error.response?.data?.message || 'Không thể cập nhật trạng thái giới hạn!');
    } finally {
      setIsTogglingLimited(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-600">Đang tải...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Chi tiết Người dùng</h1>
          <p className="text-sm text-slate-600 mt-1">Cập nhật thông tin tài khoản</p>
        </div>

        {user ? (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tài khoản</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-500"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Số tài khoản</label>
                <input
                  type="text"
                  name="new_account_number"
                  value={formData.new_account_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                >
                  <option value="Đã kích hoạt">Đã kích hoạt</option>
                  <option value="Đã khóa">Đã khóa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ngày kích hoạt</label>
                <input
                  type="text"
                  value={user.activation_date ? new Date(user.activation_date).toLocaleDateString('vi-VN') : 'Chưa kích hoạt'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-500"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ngày hết hạn</label>
                <input
                  type="date"
                  name="new_expiration_date"
                  value={formData.new_expiration_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 disabled:bg-slate-50 disabled:text-slate-500"
                  required={formData.status === 'Đã kích hoạt'}
                  disabled={formData.status === 'Đã khóa'}
                />
              </div>

              {/* Limited Status Section */}
              <div className="border-t border-slate-200 pt-4 mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-700">Trạng thái giới hạn</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                    user.limited 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {user.limited ? 'Bị giới hạn' : 'Bình thường'}
                  </span>
                </div>
                <button
                  onClick={handleToggleLimited}
                  disabled={isTogglingLimited}
                  className={`w-full px-4 py-2.5 rounded-md font-medium transition-colors ${
                    user.limited
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isTogglingLimited 
                    ? 'Đang xử lý...' 
                    : user.limited 
                      ? 'Bỏ giới hạn tài khoản' 
                      : 'Giới hạn tài khoản'
                  }
                </button>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Người dùng không tồn tại.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
