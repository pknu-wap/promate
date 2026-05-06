import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "./authStore.js";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const profileCompleted = searchParams.get("profileCompleted");

    if (!accessToken) {
      console.error("accessToken이 없습니다.");
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
      navigate("/login");
      return;
    }

    login(accessToken);

    if (profileCompleted === "false") {
      navigate("/profile-setup");
      return;
    }

    navigate("/dashboard");
  }, [searchParams, navigate, login]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#F8F9FA",
      }}
    >
      <h2>카카오 로그인 처리 중입니다...</h2>
    </div>
  );
}