import { useState } from "react";
import kakaoLogo from "../../../assets/kakao_logo.svg";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function LoginForm({ onLogin, isLoading }) {
  const [keepLogin, setKeepLogin] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin();
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <a
        href={`${baseUrl}/api/auth/kakao/login`}
        className="kakao-login-btn"
      >
        <span className="kakao-login-content">
          <img src={kakaoLogo} alt="카카오 로고" className="kakao-icon" />

          <span className="kakao-login-text">
            카카오 로그인으로 시작
          </span>
        </span>
      </a>
    </form>
  );
}

export default LoginForm;