import "./LoginPage.css";
import LoginLogo from "./components/LoginLogo";
import LoginForm from "./components/LoginForm";

function LoginPage() {
  const handleLogin = () => {
    console.log("카카오 로그인 시도");
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <LoginLogo />
        <LoginForm onLogin={handleLogin} />
      </section>
    </main>
  );
}

export default LoginPage;