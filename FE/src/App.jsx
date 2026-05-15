import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar/Sidebar";
import Header from "./components/Header/Header";
import ComingSoonPage from "./pages/ComingSoonPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback/AuthCallback.jsx";
import TeammakingPage from "./pages/Teammaking/TeammakingPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import ApplicantPage from "./pages/Applicant/ApplicantList.jsx";
import ApplicantDetail from "./pages/Applicant/ApplicantDetail.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import FindTeamPage from "./pages/FindTeam/FindTeamPage.jsx";
import ProjectPage from "./pages/ProjectPage/ProjectPage.jsx";

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
          <Route path="/teammaking" element={<TeammakingPage />} />
          <Route path="/applicant" element={<ApplicantPage/>} />
          <Route path="/applicant/detail" element={<ApplicantDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/find-team" element={<FindTeamPage />} />
          <Route path="/project" element={<ProjectPage />} />
         
          <Route path="*" element={<ComingSoonPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
