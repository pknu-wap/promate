import { useState } from "react";
import "./LoginPage.css";
import LoginLogo from "./components/LoginLogo";
import LoginForm from "./components/LoginForm";
import { getKakaoLoginUrl } from "../../api/kakaoAuthApi.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const kakaoHandleLogin = async () => {
    setIsLoading(true);

    try {
      const backendUrl = await getKakaoLoginUrl();
      window.location.href = backendUrl;
    } catch (error) {
      console.error("로그인 URL 요청 실패:", error);
      alert("로그인 서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <LoginLogo />
        <a href={`${baseUrl}/api/auth/kakao/login`}>카카오 로그인</a>
        <LoginForm onLogin={kakaoHandleLogin} isLoading={isLoading} />
      </section>
    </main>
  );
}

export default LoginPage;