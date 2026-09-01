import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import HomeAdminPage from './pages/HomeAdminPage'
import QrisConfirmPage from './pages/QrisConfirmPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<HomeAdminPage />} />
        <Route path="/homeadmin" element={<Navigate to="/admin" replace />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-confirm" element={<QrisConfirmPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
