import kakaoLogo from '../../../assets/kakao_logo.svg';

function LoginForm({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <button type="submit" className="kakao-login-btn">
        <span className="kakao-login-content">
          <img
            src={kakaoLogo}
            alt="카카오 로고"
            className="kakao-icon"
          />
          <span className="kakao-login-text">카카오 로그인으로 시작</span>
        </span>
      </button>

      <label className="keep-login">
        <input type="checkbox" />
        <span>로그인 상태 유지</span>
      </label>
    </form>
  );
}

export default LoginForm;