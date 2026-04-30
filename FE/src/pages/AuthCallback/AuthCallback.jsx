import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { requestKakaoLogin } from "../../apis/authApi";

export default function AuthCallback() {
  const navigate = useNavigate();
  const isRequesting = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const saved = localStorage.getItem("oauth_state");

    if (!code || state !== saved) {
      console.error("Invalid state or missing code");
      navigate("/login", { replace: true });
      return;
    }

    const handleLogin = async () => {
      // React 18 Strict Mode로 인한 중복 호출을 방지합니다.
      if (isRequesting.current) {
        return;
      }
      isRequesting.current = true;

      try {
        const data = await requestKakaoLogin(code, state);
        if (data?.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
        // 필요 시 state 제거
        localStorage.removeItem("oauth_state");
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Kakao login failed:", err);
        navigate("/login", { replace: true });
      }
    };

    handleLogin();
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}