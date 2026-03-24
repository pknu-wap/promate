import promate_logo from '../../../assets/promate_logo.svg';

function LoginLogo() {
  return (
    <header className="logo-section">
      <div className="logo-row">
        <div className="logo-wrapper">
          <img src={promate_logo} alt="ProMate 로고" />
        </div>
      </div>
      <p className="service-subtitle">최고의 팀과 협업하세요.</p>
    </header>
  );
}

export default LoginLogo;