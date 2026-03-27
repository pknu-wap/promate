import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelfPRPage from "./pages/SelfPRPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelfPRPage />} />
        <Route path="/self-pr" element={<SelfPRPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
