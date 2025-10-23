
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

function RentalPlanManagement() {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ duration: '', price: '' });
  const [editPlan, setEditPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.rentalPlans}`);
      if (response.data.success) {
        setPlans(response.data.plans || []);
      } else {
        setError(response.data.message || 'Không thể tải danh sách gói gia hạn.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách gói gia hạn.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.createRentalPlan}`, {
        duration: parseInt(newPlan.duration),
        price: parseFloat(newPlan.price)
      });
      if (response.data.success) {
        alert(response.data.message);
        setNewPlan({ duration: '', price: '' });
        fetchPlans();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi thêm gói gia hạn.');
    }
  };

  const handleEditPlan = async (e) => {
    e.preventDefault();
    if (!editPlan) return;
    try {
      const response = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.updateRentalPlan.replace(':id', editPlan.id)}`, {
        price: parseFloat(editPlan.price)
      });
      if (response.data.success) {
        alert(response.data.message);
        setEditPlan(null);
        fetchPlans();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật gói gia hạn.');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa gói này?')) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.updateRentalPlan.replace(':id', id)}`);
      if (response.data.success) {
        alert(response.data.message);
        fetchPlans();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi xóa gói gia hạn.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-600">Đang tải...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-red-600">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Gói Gia Hạn</h1>
          <p className="text-sm text-slate-600 mt-1">Tạo và quản lý các gói gia hạn dịch vụ</p>
        </div>

        {/* Add New Plan Form */}
        <form onSubmit={handleAddPlan} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Thêm Gói Mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Số ngày</label>
              <input
                type="number"
                name="duration"
                value={newPlan.duration}
                onChange={handleAddChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                placeholder="VD: 30"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Giá (VNĐ)</label>
              <input
                type="number"
                name="price"
                value={newPlan.price}
                onChange={handleAddChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                placeholder="VD: 100000"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors"
          >
            Thêm gói
          </button>
        </form>

        {/* Plan List */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Số ngày</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Giá</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-900">{plan.duration} ngày</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{plan.price.toLocaleString('vi-VN')} VNĐ</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => setEditPlan({ ...plan })}
                      className="text-blue-600 hover:text-blue-700 font-medium mr-4"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {plans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Không có gói gia hạn nào.</p>
            </div>
          )}
        </div>

        {/* Edit Plan Form */}
        {editPlan && (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <form onSubmit={handleEditPlan} className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Sửa Gói</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Số ngày</label>
                  <input
                    type="text"
                    value={editPlan.duration}
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Giá (VNĐ)</label>
                  <input
                    type="number"
                    name="price"
                    value={editPlan.price}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium transition-colors"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setEditPlan(null)}
                  className="flex-1 bg-slate-500 hover:bg-slate-600 text-white py-2.5 rounded-md font-medium transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default RentalPlanManagement;
