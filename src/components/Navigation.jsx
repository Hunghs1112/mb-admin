import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="bg-gray-900 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to={isAuthenticated ? '/home' : '/login'} className="text-white text-2xl font-bold hover:text-blue-400 transition duration-300">Quản lí MB</Link>
                <div className="flex items-center space-x-6">
                    {isAuthenticated && (
                        <>
                            <Link to="/home" className="text-white hover:text-blue-400 transition duration-300">Trang chủ</Link>
                            <Link to="/deposit" className="text-white hover:text-blue-400 transition duration-300">Nạp tiền</Link>
                            <Link to="/change-account-info" className="text-white hover:text-blue-400 transition duration-300">Đổi thông tin tài khoản</Link>
                            <Link to="/renew-account" className="text-white hover:text-blue-400 transition duration-300">Gia hạn tài khoản</Link>
                            <button 
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                            >
                                Đăng xuất
                            </button>
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="text-white hover:text-blue-400 transition duration-300">Đăng nhập</Link>
                            <Link to="/register" className="text-white hover:text-blue-400 transition duration-300">Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navigation;