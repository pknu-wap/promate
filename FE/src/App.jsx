import React, { useState } from "react"; 
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar/Sidebar";
import Header from "./components/Header/Header";
import SelfPRPage from "./pages/SelfPRPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback/AuthCallback.jsx";
import TeammakingPage from "./pages/Teammaking/TeammakingPage.jsx";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header onMenuClick={toggleMenu} />
        <div style={{ display: 'flex', flex: 1, background: 'linear-gradient(180deg, #f0f0f0 0%, #ffffff 100%)' }}>
          <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, padding: '20px', boxSizing: 'border-box' }}>
              <Routes>
                <Route path="/" element={<SelfPRPage />} />
                <Route path="/self-pr" element={<SelfPRPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/teammaking" element={<TeammakingPage />} />
                <Route path="/auth/kakao/callback" element={<AuthCallback />} />
              </Routes>
            </main>
          </div>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;