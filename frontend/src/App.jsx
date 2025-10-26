import React from 'react';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const isAuth = () => {
  // Пока заглушка: true если есть token в localStorage
  return !!localStorage.getItem('userToken');
};

const App = () => (
  <div className="h-100 bg-light">
    <Routes>
      <Route
        path="/"
        element={isAuth() ? <ChatPage /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </div>
);

export default App;
