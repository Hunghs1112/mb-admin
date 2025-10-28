
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navigation({ setIsAuthenticated }) {
  const [isAuthenticated, setLocalIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial authentication status from localStorage
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      setLocalIsAuthenticated(auth);
    };

    // Run check on mount
    checkAuth();

    // Listen for storage changes (e.g., from other tabs or logout in another instance)
    const handleStorageChange = (event) => {
      if (event.key === 'isAuthenticated') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false); // Update App's state
    alert('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white">
      <nav className="flex justify-between items-center max-w-4xl mx-auto p-4">
        <div className="space-x-6">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `hover:text-gray-300 ${isActive ? 'text-yellow-400' : ''}`
            }
          >
            Trang chủ
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/qr-update"
                className={({ isActive }) =>
                  `hover:text-gray-300 ${isActive ? 'text-yellow-400' : ''}`
                }
              >
                Cập nhật QR
              </NavLink>
              <NavLink
                to="/rental-plan-management"
                className={({ isActive }) =>
                  `hover:text-gray-300 ${isActive ? 'text-yellow-400' : ''}`
                }
              >
                Cập nhật Gói Gia Hạn
              </NavLink>
            </>
          )}
        </div>
        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Đăng xuất
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `hover:text-gray-300 ${isActive ? 'text-yellow-400' : ''}`
              }
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
