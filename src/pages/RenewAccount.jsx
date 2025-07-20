    import { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';
    import API_CONFIG from '../config/apiConfig';

    function RenewAccount() {
        const [plans, setPlans] = useState([]);
        const [selectedPlan, setSelectedPlan] = useState('');
        const [amount, setAmount] = useState(0);
        const [bankCode, setBankCode] = useState('');
        const [accountNumber, setAccountNumber] = useState('');
        const { user, message, setAuthMessage } = useAuth();
        const navigate = useNavigate();

        useEffect(() => {
            fetchRentalPlans();
            fetchQrInfo();
        }, []);

        useEffect(() => {
            if (message) {
                alert(message);
                setAuthMessage('');
            }
        }, [message, setAuthMessage]);

        const fetchRentalPlans = async () => {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/rental-plans`);
                const data = await response.json();
                if (data.success) {
                    setPlans(data.plans);
                } else {
                    alert('Lỗi tải danh sách gói gia hạn!');
                    setAuthMessage('');
                }
            } catch (error) {
                alert('Lỗi kết nối server!');
                setAuthMessage('');
                console.error(error);
            }
        };

        const fetchQrInfo = async () => {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/qr-codes`);
                const data = await response.json();
                if (data.success) {
                    setBankCode(data.bank_code);
                    setAccountNumber(data.account_number);
                } else {
                    alert('Lỗi tải thông tin QR!');
                    setAuthMessage('');
                }
            } catch (error) {
                alert('Lỗi kết nối server!');
                setAuthMessage('');
                console.error(error);
            }
        };

        const handlePlanChange = async (e) => {
            const planId = e.target.value;
            setSelectedPlan(planId);
            if (planId) {
                try {
                    const response = await fetch(`${API_CONFIG.BASE_URL}/rental-plans/${planId}`);
                    const data = await response.json();
                    if (data.success) {
                        const { price } = data.plan;
                        setAmount(price);
                    }
                } catch (error) {
                    alert('Lỗi tải giá!');
                    setAuthMessage('');
                    console.error(error);
                }
            } else {
                setAmount(0);
            }
        };

        const handleConfirm = async () => {
            if (!selectedPlan || amount <= 0) {
                alert('Vui lòng chọn gói hợp lệ!');
                return;
            }
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.id,
                        amount,
                        user_account_number: user.account_number,
                        user_name: user.name,
                        status: 'pending'
                    })
                });
                const data = await response.json();
                if (data.success) {
                    alert('Yêu cầu thanh toán đã được gửi!');
                    setAuthMessage('');
                    navigate('/home');
                } else {
                    alert(data.message || 'Lỗi gửi yêu cầu thanh toán!');
                    setAuthMessage('');
                }
            } catch (error) {
                alert('Lỗi kết nối server!');
                setAuthMessage('');
                console.error(error);
            }
        };

        const qrUrl = bankCode && accountNumber
            ? `https://qrcode.io.vn/api/generate/${bankCode}/${accountNumber}/giahan_taikhoan`
            : '';

        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md">
                    <h2 className="text-4xl font-bold mb-6 text-white text-center">Gia hạn tài khoản</h2>
                    <form className="space-y-4">
                        <select
                            value={selectedPlan}
                            onChange={handlePlanChange}
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn gói gia hạn</option>
                            {plans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.duration} - ${plan.price}
                                </option>
                            ))}
                        </select>
                    </form>
                    {selectedPlan && bankCode && accountNumber && (
                        <div className="mt-6 text-center">
                            <p className="text-white">Chuyển khoản đến:</p>
                            <p className="text-white">Ngân hàng: {bankCode}</p>
                            <p className="text-white">Số tài khoản: {accountNumber}</p>
                            <p className="text-white">Số tiền: ${amount} (Nhập thủ công khi quét QR)</p>
                            <p className="text-white">Nội dung: Gia hạn tài khoản</p>
                            <img src={qrUrl} alt="QR Code" className="mx-auto mt-2" />
                            <button
                                onClick={handleConfirm}
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                            >
                                Xác nhận thanh toán
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    export default RenewAccount;