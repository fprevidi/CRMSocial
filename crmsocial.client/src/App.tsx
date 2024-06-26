import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import RecuperoPassword from './components/Login/RecuperoPassword';
import LayoutWithNavbar from './components/LayoutWithNavBar';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './components/Login/ResetPassword';
import Home from './components/Home/Home';




const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const authToken = localStorage.getItem('authToken');
        return !!authToken; // Imposta isAuthenticated in base alla presenza del token
    });
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        setIsAuthenticated(!!authToken);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/Login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} onLoginFailure={() => setIsAuthenticated(false) } />} />
                <Route path="/RecuperoPassword" element={<RecuperoPassword/>} />
                <Route path="/ResetPassword" element={<ResetPassword/>} />
                <Route path="/" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <LayoutWithNavbar>
                            <Home />
                        </LayoutWithNavbar>
                    </ProtectedRoute>
                } />
             
            </Routes>
        </Router>
    );
};

export default App;
