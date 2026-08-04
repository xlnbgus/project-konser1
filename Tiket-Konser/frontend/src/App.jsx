import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import HomeAdminPage from './pages/HomeAdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<HomeAdminPage />} />
        <Route path="/homeadmin" element={<Navigate to="/admin" replace />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Routes>
    </BrowserRouter>
  )
}
