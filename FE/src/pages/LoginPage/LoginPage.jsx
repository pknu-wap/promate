import { useState } from "react";
import "./LoginPage.css";
import LoginLogo from "./components/LoginLogo";
import LoginForm from "./components/LoginForm";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const createOAuthState = () => {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);

    return Array.from(array, (number) => number.toString(36)).join("");
  };

  const kakaoHandleLogin = (keepLogin) => {
    setIsLoading(true);

    const url = new URL("https://kauth.kakao.com/oauth/authorize");

    url.searchParams.append("client_id", KAKAO_CLIENT_ID);
    url.searchParams.append("redirect_uri", REDIRECT_URI);
    url.searchParams.append("response_type", "code");

    const state = createOAuthState();
    localStorage.setItem("oauth_state", state);
    localStorage.setItem("keep_login", keepLogin);
    url.searchParams.append("state", state);

    window.location.href = url.toString();
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