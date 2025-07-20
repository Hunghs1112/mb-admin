import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Withdraw from './pages/Withdraw';
import Deposit from './pages/Deposit';
import ChangeAccountInfo from './pages/ChangeAccountInfo';
import RenewAccount from './pages/RenewAccount';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navigation />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/withdraw" element={<Withdraw />} />
                    <Route path="/deposit" element={<Deposit />} />
                    <Route path="/change-account-info" element={<ChangeAccountInfo />} />
                    <Route path="/renew-account" element={<RenewAccount />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;