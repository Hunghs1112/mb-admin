import { useState, useEffect } from 'react';

function Admin() {
    const [users, setUsers] = useState([]);
    const [cashInUsername, setCashInUsername] = useState('');
    const [cashInAccountNumber, setCashInAccountNumber] = useState('');
    const [cashInAmount, setCashInAmount] = useState('');
    const [cashInRecipientName, setCashInRecipientName] = useState('');
    const [cashInRecipientAccount, setCashInRecipientAccount] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch('http://localhost:5000/users?username=admin');
        const data = await response.json();
        if (data.success) {
            setUsers(data.users);
        } else {
            alert(data.message || 'Lỗi tải danh sách người dùng!');
        }
    };

    const handleCashIn = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/cash-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: cashInUsername,
                account_number: cashInAccountNumber,
                amount: parseFloat(cashInAmount),
                recipient_name: cashInRecipientName,
                recipient_account_number: cashInRecipientAccount,
            }),
        });
        const data = await response.json();
        if (data.success) {
            alert('Nạp tiền thành công!');
            fetchUsers();
            setCashInAmount('');
            setCashInRecipientName('');
            setCashInRecipientAccount('');
            setCashInUsername('');
            setCashInAccountNumber('');
        } else {
            alert(data.message || 'Lỗi nạp tiền!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-5xl">
                <h2 className="text-4xl font-bold mb-6 text-white text-center">Trang Quản trị</h2>
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Danh sách tài khoản</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-700 border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-gray-600">
                                    <th className="py-3 px-4 border-b border-gray-500 text-left text-white">Tên</th>
                                    <th className="py-3 px-4 border-b border-gray-500 text-left text-white">Tài khoản nhận</th>
                                    <th className="py-3 px-4 border-b border-gray-500 text-left text-white">Số dư</th>
                                    <th className="py-3 px-4 border-b border-gray-500 text-left text-white">Số tài khoản nhận</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="py-3 px-4 border-b border-gray-600 text-white">{user.name}</td>
                                        <td className="py-3 px-4 border-b border-gray-600 text-white">{user.username}</td>
                                        <td className="py-3 px-4 border-b border-gray-600 text-white">${(user.balance / 100).toFixed(2)}</td>
                                        <td className="py-3 px-4 border-b border-gray-600 text-white">{user.account_number}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Nạp tiền</h3>
                    <form onSubmit={handleCashIn} className="space-y-4">
                        <input
                            type="text"
                            value={cashInUsername}
                            onChange={(e) => setCashInUsername(e.target.value)}
                            placeholder="Tài khoản nhận"
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={cashInAccountNumber}
                            onChange={(e) => setCashInAccountNumber(e.target.value)}
                            placeholder="Số tài khoản nhận"
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            value={cashInAmount}
                            onChange={(e) => setCashInAmount(e.target.value)}
                            placeholder="Số tiền nạp"
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={cashInRecipientName}
                            onChange={(e) => setCashInRecipientName(e.target.value)}
                            placeholder="Tên người gửi"
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={cashInRecipientAccount}
                            onChange={(e) => setCashInRecipientAccount(e.target.value)}
                            placeholder="Số tài khoản người gửi"
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                        >
                            Nạp tiền
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Admin;