import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelfPRPage from "./pages/SelfPRPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelfPRPage />} />
        <Route path="/self-pr" element={<SelfPRPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
