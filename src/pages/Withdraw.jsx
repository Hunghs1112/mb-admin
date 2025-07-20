import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/apiConfig';

function Withdraw() {
    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientAccount, setRecipientAccount] = useState('');
    const { user, isUnlocked, setAuthMessage } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isUnlocked) {
            alert('Tài khoản của bạn đã bị khóa. Vui lòng gia hạn để sử dụng!');
            setAuthMessage('');
            navigate('/renew-account');
        }
    }, [isUnlocked, setAuthMessage, navigate]);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/cash-out`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    account_number: user.account_number,
                    amount: parseFloat(amount),
                    recipient_account_number: recipientAccount,
                    recipient_name: recipientName,
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Rút tiền thành công!');
                setAuthMessage('');
                setAmount('');
                setRecipientName('');
                setRecipientAccount('');
            } else {
                alert(data.message || 'Lỗi rút tiền!');
                setAuthMessage('');
            }
        } catch (error) {
            alert('Lỗi kết nối server!');
            setAuthMessage('');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-4xl font-bold mb-6 text-white text-center">Rút tiền</h2>
                <form onSubmit={handleWithdraw} className="space-y-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Số tiền"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Tên người nhận"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        value={recipientAccount}
                        onChange={(e) => setRecipientAccount(e.target.value)}
                        placeholder="Số tài khoản người nhận"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                    >
                        Rút tiền
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Withdraw;