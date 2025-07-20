
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Home from './components/Home';
import UserDetail from './components/UserDetail';
import QrUpdate from './components/QrUpdate';
import RentalPlanManagement from './components/RentalPlanManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  return (
    <Router>
      <Navigation setIsAuthenticated={setIsAuthenticated} />
      <div className="container mx-auto p-4">
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/user/:account_number"
            element={isAuthenticated ? <UserDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/qr-update"
            element={isAuthenticated ? <QrUpdate /> : <Navigate to="/login" />}
          />
          <Route
            path="/rental-plan-management"
            element={isAuthenticated ? <RentalPlanManagement /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
