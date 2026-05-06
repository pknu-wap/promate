import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar/Sidebar";
import Header from "./components/Header/Header";
import SelfPRPage from "./pages/SelfPRPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback/AuthCallback.jsx";
import TeammakingPage from "./pages/Teammaking/TeammakingPage.jsx";
import FindTeamPage from "./pages/FindTeam/FindTeamPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";

function AppLayout({ isMenuOpen, toggleMenu, closeMenu }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header onMenuClick={toggleMenu} />
      <div style={{ display: "flex", flex: 1, backgroundColor: "#F8F9FA" }}>
        <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <main style={{ flex: 1, padding: "0px", boxSizing: "border-box" }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

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
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/kakao/callback" element={<AuthCallback />} />

        <Route
          element={
            <AppLayout
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              closeMenu={closeMenu}
            />
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/self-pr" element={<SelfPRPage />} />
          <Route path="/teammaking" element={<TeammakingPage />} />
          <Route path="/find-team" element={<FindTeamPage />} />
      
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
