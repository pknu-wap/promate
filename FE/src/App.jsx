import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SelfPRPage from "./pages/SelfPRPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import TeammakingPage from "./pages/Teammaking/TeammakingPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelfPRPage />} />
        <Route path="/self-pr" element={<SelfPRPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teammaking" element={<TeammakingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
