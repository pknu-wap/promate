import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestKakaoLogin } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRequesting = useRef(false);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const savedState = localStorage.getItem("oauth_state");

    if (!code) {
      console.error("인가 코드가 없습니다.");
      navigate("/login");
      return;
    }

    if (state !== savedState) {
      console.error("비정상적인 접근입니다. (state 불일치)");
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
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
        localStorage.removeItem("oauth_state");
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