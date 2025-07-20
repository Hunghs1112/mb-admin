import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_CONFIG from '../config/apiConfig';

function Home() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 10;
    const { user, isUnlocked, message, setAuthMessage } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isUnlocked) {
            alert('Tài khoản của bạn đã bị khóa. Vui lòng gia hạn để sử dụng!');
            setAuthMessage('');
            navigate('/renew-account');
            return;
        }
        if (user) {
            fetchTransactions();
        }
    }, [isUnlocked, user, setAuthMessage, navigate]);

    useEffect(() => {
        if (message) {
            alert(message);
            setAuthMessage('');
        }
    }, [message, setAuthMessage]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/transactions?username=${user.username}`);
            const data = await response.json();
            if (data.success) {
                const sortedTransactions = data.transactions.sort((a, b) => 
                    new Date(b.timestamp) - new Date(a.timestamp)
                );
                setTransactions(sortedTransactions);
                setFilteredTransactions(sortedTransactions);
            } else {
                alert(data.message || 'Lỗi tải danh sách giao dịch!');
                setAuthMessage('');
            }
        } catch (error) {
            alert('Lỗi kết nối đến server!');
            setAuthMessage('');
            console.error('Error fetching transactions:', error);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1);
        const filtered = transactions.filter((transaction) =>
            transaction.username.toLowerCase().includes(term)
        );
        setFilteredTransactions(filtered);
    };

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-5xl">
                <h2 className="text-4xl font-bold mb-6 text-white text-center">Lịch sử giao dịch</h2>
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Tìm kiếm theo tài khoản..."
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-8">
                    <table className="min-w-full bg-gray-700 border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-gray-600">
                                <th className="py-3 px-4 border-b border-gray-500 text-left text-white">Loại</th>
                                <th className="py-3 px-4 border-b border-gray-500 text-left text-white">Số tiền</th>
                                <th className="py-3 px-4 border-b border-gray-500 text-left text-white">Người nhận</th>
                                <th className="py-3 px-4 border-b border-gray-500 text-left text-white">Số tài khoản người nhận</th>
                                <th className="py-3 px-4 border-b border-gray-500 text-left text-white">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td className="py-3 px-4 border-b border-gray-600 text-white">{transaction.type}</td>
                                    <td className="py-3 px-4 border-b border-gray-600 text-white">${Number(transaction.amount).toFixed(2)}</td>
                                    <td className="py-3 px-4 border-b border-gray-600 text-white">{transaction.recipient_name || '-'}</td>
                                    <td className="py-3 px-4 border-b border-gray-600 text-white">{transaction.recipient_account_number || '-'}</td>
                                    <td className="py-3 px-4 border-b border-gray-600 text-white">
                                        {transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 hover:bg-gray-500 transition duration-300"
                        >
                            Trước
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === index + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-600 text-white hover:bg-gray-500'
                                } transition duration-300`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 hover:bg-gray-500 transition duration-300"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;