
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navigation({ setIsAuthenticated }) {
  const [isAuthenticated, setLocalIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      setLocalIsAuthenticated(auth);
    };

    checkAuth();

    const handleStorageChange = (event) => {
      if (event.key === 'isAuthenticated') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    alert('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">Trang quản lí</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive 
                  ? 'text-blue-400' 
                  : 'text-slate-300 hover:text-white'
              }`
            }
          >
            Trang chủ
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/qr-update"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-blue-400' 
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                Cập nhật QR
              </NavLink>
              <NavLink
                to="/rental-plan-management"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-blue-400' 
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                Gói Gia Hạn
              </NavLink>
            </>
          )}
        </div>

        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
            >
              Đăng xuất
            </button>
          ) : (
            <NavLink
              to="/login"
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              Đăng nhập
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navigation;
