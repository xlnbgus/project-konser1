import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import HomeAdminPage from './pages/HomeAdminPage'
import QrisConfirmPage from './pages/QrisConfirmPage'
import ToastContainer from './components/Toast'

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
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
