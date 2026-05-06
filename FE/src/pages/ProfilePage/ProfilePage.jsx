import React, { useState } from 'react';
import MainButton from '../../components/MainButton/MainButton';
import Avatar from '../../components/Avatar/Avatar';
import './ProfilePage.css';
import '../Teammaking/TeammakingPage.css';

const MAX_DESC_LENGTH = 50;

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: '김아무개',
    taskStats: { completed: 3, total: 5 },
  });

  const [projects, setProjects] = useState([
    { id: 1, title: '동아리 프로젝트', role: 'PM', startDate: '2025-03-20', endDate: null, score: null },
    { id: 2, title: 'WAP 해커톤', role: 'FE', startDate: '2025-03-20', endDate: '2025-07-20', score: 4.7 },
  ]);

  const [manualProjects, setManualProjects] = useState([]);
  const [editInfo, setEditInfo] = useState({});
  const [editProjects, setEditProjects] = useState([]);
  const [editManualProjects, setEditManualProjects] = useState([]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${y}.${m}.${d}`;
  };

  const handleEditStart = () => {
    setEditInfo({ name: userInfo.name });
    setEditProjects(projects.map((p) => ({ ...p })));
    setEditManualProjects(manualProjects.map((p) => ({ ...p })));
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: API 연동
    setUserInfo((prev) => ({ ...prev, name: editInfo.name }));
    setProjects(editProjects.map((p) => ({ ...p })));
    setManualProjects(editManualProjects.map((p) => ({ ...p })));
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  const updateProjectRole = (id, value) => {
    setEditProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, role: value } : p))
    );
  };

  const updateManual = (id, field, value) => {
    setEditManualProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const addManual = () => {
    setEditManualProjects((prev) => [
      ...prev,
      { id: Date.now(), title: '', role: '', startDate: '', endDate: '', description: '' },
    ]);
  };

  const removeManual = (id) => {
    setEditManualProjects((prev) => prev.filter((p) => p.id !== id));
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
            </div>
          </div>

          <hr className="profile-divider" />

          <div className="form-field">
            <label className="form-label">
              프로젝트 경험
              <span className="form-label-sub"> (직무 수정 가능)</span>
            </label>
            <div className="project-edit-list">
              {editProjects.map((proj) => (
                <div key={proj.id} className="promate-edit-row">
                  <div className="promate-edit-info">
                    <span className="proj-title">{proj.title}</span>
                    <span className="proj-period">
                      {formatDate(proj.startDate)}{proj.endDate ? ` ~ ${formatDate(proj.endDate)}` : ' ~'}
                    </span>
                  </div>
                  <input
                    className="text-input manual-role-input"
                    value={proj.role}
                    onChange={(e) => updateProjectRole(proj.id, e.target.value)}
                    placeholder="직무"
                  />
                </div>
              ))}
            </div>
          </div>

          <hr className="profile-divider" />

          <div className="form-field">
            <label className="form-label">
              과거 프로젝트 이력
              <span className="form-label-sub"> (프로메이트 외부)</span>
            </label>
            <div className="project-edit-list">
              {editManualProjects.map((proj) => (
                <div key={proj.id} className="manual-edit-card">
                  <div className="manual-edit-row">
                    <input
                      className="text-input manual-title-input"
                      value={proj.title}
                      onChange={(e) => updateManual(proj.id, 'title', e.target.value)}
                      placeholder="프로젝트 이름 *"
                    />
                    <input
                      className="text-input manual-role-input"
                      value={proj.role}
                      onChange={(e) => updateManual(proj.id, 'role', e.target.value)}
                      placeholder="직무 (선택)"
                    />
                    <button className="proj-remove-btn" onClick={() => removeManual(proj.id)}>×</button>
                  </div>
                  <div className="manual-edit-row">
                    <input
                      type="date"
                      className="text-input proj-edit-date"
                      value={proj.startDate}
                      onChange={(e) => updateManual(proj.id, 'startDate', e.target.value)}
                    />
                    <span className="proj-edit-sep">~</span>
                    <input
                      type="date"
                      className="text-input proj-edit-date"
                      value={proj.endDate}
                      onChange={(e) => updateManual(proj.id, 'endDate', e.target.value)}
                    />
                  </div>
                  <div className="manual-desc-wrap">
                    <textarea
                      className="textarea-input manual-desc-input"
                      value={proj.description}
                      maxLength={MAX_DESC_LENGTH}
                      onChange={(e) => updateManual(proj.id, 'description', e.target.value)}
                      placeholder="프로젝트 내용을 간략히 입력하세요"
                      rows={2}
                    />
                    <span className="char-count">
                      {proj.description.length}/{MAX_DESC_LENGTH}
                    </span>
                  </div>
                </div>
              ))}
              <button className="proj-add-btn" onClick={addManual}>+ 과거 프로젝트 추가</button>
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
        {/* 상단: 아바타+이름 / 온도 */}
        <div className="profile-header-row">
          <div className="profile-user-info">
            <Avatar src="/default-profile.png" alt="프로필" size="lg" />
            <div className="profile-name-block">
              <h2 className="user-name-text">{userInfo.name}</h2>
            </div>
          </div>
          <div className="user-task-display">
            <span className="task-stats-num">
              {userInfo.taskStats.completed}/{userInfo.taskStats.total}
            </span>
            <span className="task-stats-label">완료</span>
          </div>
        </div>

        <hr className="profile-divider" />

        {/* 프로젝트 경험 */}
        <div className="form-field">
          <label className="form-label">프로젝트 경험</label>
          <div className="project-experience-list">
            {[...projects]
              .sort((a, b) => (a.endDate ? 1 : -1) - (b.endDate ? 1 : -1))
              .map((proj) => (
                <div key={proj.id} className="project-experience-row">
                  <div className="proj-row-inner">
                    {/* 왼쪽: 이름 + 역할 */}
                    <div className="proj-name-group">
                      <span className="proj-title">{proj.title}</span>
                      <span className="proj-role">{proj.role}</span>
                    </div>
                    {/* 오른쪽: 기간 + 배지 + 점수 */}
                    <div className="proj-right-group">
                      <span className="proj-period">
                        {formatDate(proj.startDate)}{proj.endDate ? ` ~ ${formatDate(proj.endDate)}` : ' ~'}
                      </span>
                      <span className={proj.endDate ? 'badge-completed' : 'badge-ongoing'}>
                        <span>{proj.endDate ? '완료' : '진행중'}</span>
                      </span>
                      <div className="proj-score-container">
                        {proj.score != null ? (
                          <>
                            <span className="proj-score-num">{proj.score.toFixed(1)}</span>
                            <span className="proj-score-text">점</span>
                          </>
                        ) : (
                          <span style={{ width: 47 }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {manualProjects.map((proj) => (
              <div key={proj.id} className="project-experience-row">
                <div className="proj-row-inner">
                  <div className="proj-name-group">
                    <span className="proj-title">{proj.title}</span>
                    {proj.role && <span className="proj-role">{proj.role}</span>}
                  </div>
                  <div className="proj-right-group">
                    <span className="proj-period">
                      {formatDate(proj.startDate)}{proj.endDate ? ` ~ ${formatDate(proj.endDate)}` : ''}
                    </span>
                    {proj.description && (
                      <span className="proj-description">{proj.description}</span>
                    )}
                    <div className="proj-score-container" style={{ width: 47 }} />
                  </div>
                </div>
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