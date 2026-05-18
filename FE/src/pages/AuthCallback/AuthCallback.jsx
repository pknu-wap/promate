import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestKakaoLogin } from "../../api/kakaoAuthApi.js";
import { useAuthStore } from "../../stores/useAuthStore.js";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRequesting = useRef(false);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      console.error("인가 코드가 없습니다.");
      navigate("/login");
      return;
    }

    const handleLogin = async () => {
      if (isRequesting.current) {
        return;
      }
      isRequesting.current = true;

      try {
        const data = await requestKakaoLogin(code, state);
        if (data) {
          login(data.accessToken, data.refreshToken);
        }
        navigate("/dashboard");
      } catch (err) {
        console.error("카카오 로그인 처리 실패:", err);
        alert(err.message || "로그인 처리 중 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    handleLogin();
  }, [searchParams, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#F8F9FA" }}>
      <h2>카카오 로그인 처리 중입니다...</h2>
    </div>
  );
}