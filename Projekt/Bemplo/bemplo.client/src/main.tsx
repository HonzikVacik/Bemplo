import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import LoginPage from './Pages/Login/Login.tsx'
import RegisterPage from './Pages/Register/Register.tsx'
import DashboardPage from './Pages/Dashboard/Dashboard.tsx'
import HomePage from './Pages/Home/Home.tsx'
import PrivacyPolicyPage from './Pages/PrivacyPolicy/PrivacyPolicy.tsx'
import ChatManagerPage from './Pages/ChatManager/ChatManager.tsx'
import ChatDetailPage from './Pages/ChatDetail/ChatDetail.tsx'
import NewCommentPage from './Pages/NewComment/NewComment.tsx'
import CommentsPage from './Pages/Comments/Comments.tsx'
import SearchPage from './Pages/Search/Search.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        {/* <App /> */}
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/:id" element={<DashboardPage />} />
                <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
                <Route path="/chat" element={<ChatManagerPage />} />
                <Route path="/chatdetail/:id" element={<ChatDetailPage />} />
                <Route path="/newcomment/:userId/:id" element={<NewCommentPage />} />
                <Route path="/comments/:userId/:id" element={<CommentsPage />} />
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        </BrowserRouter>
  </StrictMode>,
)
