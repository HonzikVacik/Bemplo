import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
//import App from './App.tsx'
import LoginPage from './Pages/Login/Login.tsx'
import RegisterPage from './Pages/Register/Register.tsx'
import DashboardPage from './Pages/Dashboard/Dashboard.tsx'
import PrivacyPolicyPage from './Pages/PrivacyPolicy/PrivacyPolicy.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        {/* <App /> */}
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
            </Routes>
        </BrowserRouter>
  </StrictMode>,
)
