import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import SelfPRPage from "./pages/SelfPRPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
  return (
    <BrowserRouter>
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
        
        {/* 1. 왼쪽: 항상 고정되어 있는 사이드바 */}
        <Sidebar />

        {/* 2. 오른쪽: 주소에 따라 내용이 바뀌는 메인 화면 */}
        <div style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<SelfPRPage />} />
        <Route path="/self-pr" element={<SelfPRPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
