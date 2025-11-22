import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

const App = () => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('userToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(!!localStorage.getItem('userToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuth ? <ChatPage setIsAuth={setIsAuth} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={!isAuth ? <LoginPage setIsAuth={setIsAuth} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/signup"
       element={!isAuth ? <SignupPage setIsAuth={setIsAuth} /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;


