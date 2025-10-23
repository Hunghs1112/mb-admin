
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Cập nhật Thông tin QR</h1>
          <p className="text-sm text-slate-600 mt-1">Quản lý thông tin mã QR thanh toán</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Mã Ngân hàng
              </label>
              <input
                type="text"
                name="bank_code"
                value={qrInfo.bank_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                placeholder="VD: VCB, TCB, MB"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Số Tài khoản
              </label>
              <input
                type="text"
                name="account_number"
                value={qrInfo.account_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                placeholder="Nhập số tài khoản"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QrUpdate;
