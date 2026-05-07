import { useState } from "react";
import "./LoginPage.css";
import LoginLogo from "./components/LoginLogo";
import LoginForm from "./components/LoginForm";
import { getKakaoLoginUrl } from "../../api/authApi.js";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const createOAuthState = () => {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);

    return Array.from(array, (number) => number.toString(36)).join("");
  };

  const kakaoHandleLogin = async () => {
    setIsLoading(true);

    try {
      const backendUrl = await getKakaoLoginUrl();
      const url = new URL(backendUrl);

      const state = createOAuthState();
      localStorage.setItem("oauth_state", state);
      url.searchParams.set("state", state);

      window.location.href = url.toString();
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
        <LoginForm onLogin={kakaoHandleLogin} isLoading={isLoading} />
      </section>
    </main>
  );
}

export default LoginPage;