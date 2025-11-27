import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
//import App from './App.tsx'
import LoginPage from './Pages/Login/Login.tsx'
import RegisterPage from './Pages/Register/Register.tsx'
import DashboardPage from './Pages/Dashboard/Dashboard.tsx'
import PrivacyPolicyPage from './Pages/PrivacyPolicy/PrivacyPolicy.tsx'
import ChatManagerPage from './Pages/ChatManager/ChatManager.tsx'
import ChatDetailPage from './Pages/ChatDetail/ChatDetail.tsx'
import NewCommentPage from './Pages/NewComment/NewComment.tsx'
import CommentsPage from './Pages/Comments/Comments.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        {/* <App /> */}
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
                <Route path="/chat" element={<ChatManagerPage />} />
                <Route path="/chatdetail" element={<ChatDetailPage />} />
                <Route path="/newcomment" element={<NewCommentPage />} />
                <Route path="/comments" element={<CommentsPage />} />

            </Routes>
        </BrowserRouter>
  </StrictMode>,
)
