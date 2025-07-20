import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/apiConfig';

function ChangeAccountInfo() {
    const [name, setName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const { user, setAuthMessage } = useAuth();

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/account/${user.account_number}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, new_account_number: accountNumber }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Thông tin tài khoản đã được cập nhật!');
                setAuthMessage('');
                if (accountNumber) user.account_number = accountNumber;
                if (name) user.name = name;
            } else {
                alert(data.message || 'Lỗi cập nhật thông tin!');
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
                <h2 className="text-4xl font-bold mb-6 text-white text-center">Đổi thông tin tài khoản</h2>
                <div className="mb-6 text-center">
                    <p className="text-white text-lg">Tên hiện tại: {user?.name || 'Chưa có thông tin'}</p>
                    <p className="text-white text-lg">Số tài khoản hiện tại: {user?.account_number || 'Chưa có thông tin'}</p>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tên mới (không bắt buộc)"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Số tài khoản mới (không bắt buộc)"
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                    >
                        Cập nhật
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangeAccountInfo;