
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

function QrUpdate() {
  const [qrInfo, setQrInfo] = useState({ bank_code: '', account_number: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQrInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.qrCodes}`);
        if (response.data.success) {
          setQrInfo(response.data);
        } else {
          setError(response.data.message || 'Không thể tải thông tin QR.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi tải thông tin QR.');
      } finally {
        setLoading(false);
      }
    };
    fetchQrInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQrInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.updateQrCode}`, qrInfo);
      if (response.data.success) {
        alert('Cập nhật thông tin QR thành công!');
        navigate('/home');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật thông tin QR.');
    }
  };

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cập nhật Thông tin QR</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mã Ngân hàng</label>
          <input
            type="text"
            name="bank_code"
            value={qrInfo.bank_code}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Số Tài khoản</label>
          <input
            type="text"
            name="account_number"
            value={qrInfo.account_number}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}

export default QrUpdate;
