import React, { useState } from 'react';
import MainButton from '../../components/MainButton/MainButton';
import Avatar from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
import './ProfilePage.css';
import '../Teammaking/TeammakingPage.css';

const ROLE_OPTIONS = ['PM', 'FE', 'BE', 'Design', 'AI/ML', '기획'];

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: '김아무개',
    role: 'UIUX 디자이너',
    temp: 75,
    phone: '010.0000.0000',
    email: 'WAP1234@WAP.com',
  });

  const [projects, setProjects] = useState([
    { id: 1, title: '동아리 프로젝트', role: 'PM', startDate: '2025-03-20', endDate: null, score: 4.6 },
    { id: 2, title: 'WAP 해커톤', role: 'FE', startDate: '2025-03-20', endDate: '2025-07-20', score: 4.7 },
  ]);

  const [editInfo, setEditInfo] = useState({});
  const [editProjects, setEditProjects] = useState([]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${y}.${m}.${d}`;
  };

  const handleEditStart = () => {
    setEditInfo({ ...userInfo });
    setEditProjects(projects.map((p) => ({ ...p })));
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: API 연동
    setUserInfo((prev) => ({ ...prev, ...editInfo }));
    setProjects(editProjects.map((p) => ({ ...p })));
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  const updateProject = (id, field, value) => {
    setEditProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value === '' ? null : value } : p))
    );
  };

  const addProject = () => {
    setEditProjects((prev) => [
      ...prev,
      { id: Date.now(), title: '', role: 'FE', startDate: '', endDate: null, score: null },
    ]);
  };

  const removeProject = (id) => {
    setEditProjects((prev) => prev.filter((p) => p.id !== id));
  };

  if (isEditing) {
    return (
      <div className="page-wrapper">
        <h1 className="page-title">
          <span style={{ color: '#FE9A57' }}>{editInfo.name}</span> 님 프로필
        </h1>

        <section className="card profile-main-card">
          <div className="profile-edit-header">
            <Avatar src="/default-profile.png" alt="프로필" size="lg" />
            <div className="profile-edit-fields">
              <div className="form-field">
                <label className="form-label">이름</label>
                <input
                  className="text-input"
                  value={editInfo.name || ''}
                  onChange={(e) => setEditInfo((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="이름"
                />
              </div>
              <div className="form-field">
                <label className="form-label">역할</label>
                <input
                  className="text-input"
                  value={editInfo.role || ''}
                  onChange={(e) => setEditInfo((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="예) UIUX 디자이너"
                />
              </div>
            </div>
          </div>

          <hr className="profile-divider" />

          <div className="form-field">
            <label className="form-label">연락처</label>
            <div className="contact-edit-fields">
              <input
                className="text-input"
                value={editInfo.phone || ''}
                onChange={(e) => setEditInfo((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="전화번호"
              />
              <input
                className="text-input"
                value={editInfo.email || ''}
                onChange={(e) => setEditInfo((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="이메일"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">프로젝트 경험</label>
            <div className="project-edit-list">
              {editProjects.map((proj) => (
                <div key={proj.id} className="project-edit-row">
                  <input
                    className="text-input proj-edit-title"
                    value={proj.title}
                    onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                    placeholder="프로젝트명"
                  />
                  <select
                    className="text-input proj-edit-role"
                    value={proj.role}
                    onChange={(e) => updateProject(proj.id, 'role', e.target.value)}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="text-input proj-edit-date"
                    value={proj.startDate || ''}
                    onChange={(e) => updateProject(proj.id, 'startDate', e.target.value)}
                  />
                  <span className="proj-edit-sep">~</span>
                  <input
                    type="date"
                    className="text-input proj-edit-date"
                    value={proj.endDate || ''}
                    onChange={(e) => updateProject(proj.id, 'endDate', e.target.value)}
                    title="비워두면 진행중으로 표시됩니다"
                  />
                  <button className="proj-remove-btn" onClick={() => removeProject(proj.id)}>×</button>
                </div>
              ))}
              <button className="proj-add-btn" onClick={addProject}>+ 프로젝트 추가</button>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-cancel" onClick={handleCancel}>취소</button>
            <MainButton size="md" onClick={handleSave}>저장하기</MainButton>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <h1 className="page-title">
        <span style={{ color: '#FE9A57' }}>{userInfo.name}</span> 님 프로필
      </h1>

      <section className="card profile-main-card">
        <div className="profile-header-row">
          <div className="profile-user-info">
            <Avatar src="/default-profile.png" alt="프로필" size="lg" />
            <div className="profile-name-block">
              <h2 className="user-name-text">{userInfo.name}</h2>
              <p className="user-role-text">{userInfo.role}</p>
            </div>
          </div>
          <div className="user-temp-display">{userInfo.temp}°C</div>
        </div>

        <hr className="profile-divider" />

        <div className="form-field">
          <label className="form-label">연락처</label>
          <div className="contact-details">
            <p>📞 {userInfo.phone}</p>
            <p>✉️ {userInfo.email}</p>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">프로젝트 경험</label>
          <div className="project-experience-list">
            {projects.map((proj) => (
              <div key={proj.id} className="project-experience-row">
                <div className="proj-name-group">
                  <span className="proj-title">{proj.title}</span>
                  <span className="proj-role">{proj.role}</span>
                </div>
                <span className="proj-period">
                  {formatDate(proj.startDate)}{proj.endDate ? ` ~ ${formatDate(proj.endDate)}` : ' ~'}
                </span>
                <Badge selected={!proj.endDate}>
                  {proj.endDate ? '완료' : '진행중'}
                </Badge>
                <span className="proj-score">
                  {proj.score != null ? `${proj.score.toFixed(1)} 점` : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-actions">
          <MainButton size="md" onClick={handleEditStart}>수정하기</MainButton>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
