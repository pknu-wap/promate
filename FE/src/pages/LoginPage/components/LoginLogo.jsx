import logoImg from '../../../assets/logoOrange.svg';

function LoginLogo() {
  return (
    <header className="logo-section">
      <div className="logo-row">
        <div className="logo-wrapper">
          <img src={logoImg} alt="ProMate 로고" />
          <span className="logo-title">PRO:MATE</span>
        </div>
      </div>
      <p className="service-subtitle">최고의 팀과 협업하세요.</p>
    </header>
  );
}

export default LoginLogo;