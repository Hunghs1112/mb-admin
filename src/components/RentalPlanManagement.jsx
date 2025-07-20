
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

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quản lý Gói Gia Hạn</h2>
      
      {/* Add New Plan Form */}
      <form onSubmit={handleAddPlan} className="bg-white p-6 rounded shadow-md mb-6 max-w-md">
        <h3 className="text-lg font-semibold mb-2">Thêm Gói Mới</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Số ngày</label>
          <input
            type="number"
            name="duration"
            value={newPlan.duration}
            onChange={handleAddChange}
            className="mt-1 block w-full p-2 border rounded"
            required
            min="1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Giá</label>
          <input
            type="number"
            name="price"
            value={newPlan.price}
            onChange={handleAddChange}
            className="mt-1 block w-full p-2 border rounded"
            required
            min="0"
            step="0.01"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm
        </button>
      </form>

      {/* Plan List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Số ngày</th>
              <th className="py-2 px-4 text-left">Giá</th>
              <th className="py-2 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{plan.duration}</td>
                <td className="py-2 px-4">{plan.price} VND</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => setEditPlan({ ...plan })}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {plans.length === 0 && <p className="text-center text-gray-500 mt-4">Không có gói gia hạn nào.</p>}
      </div>

      {/* Edit Plan Form */}
      {editPlan && (
        <form onSubmit={handleEditPlan} className="bg-white p-6 rounded shadow-md mt-6 max-w-md">
          <h3 className="text-lg font-semibold mb-2">Sửa Gói</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Số ngày</label>
            <input
              type="text"
              value={editPlan.duration}
              disabled
              className="mt-1 block w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Giá</label>
            <input
              type="number"
              name="price"
              value={editPlan.price}
              onChange={handleEditChange}
              className="mt-1 block w-full p-2 border rounded"
              required
              min="0"
              step="0.01"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={() => setEditPlan(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Hủy
          </button>
        </form>
      )}
    </div>
  );
}

export default RentalPlanManagement;
