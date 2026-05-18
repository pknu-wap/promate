import React, { useState } from 'react';
import MainButton from '../../components/MainButton/MainButton';
import Avatar from '../../components/Avatar/Avatar';
import './ProfilePage.css';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isAllDay, setIsAllDay] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('12:00');
  const [newEndDate, setNewEndDate] = useState('');
  const [newEndTime, setNewEndTime] = useState('13:00');

  const [userInfo] = useState({
    name: '김아무개',
    taskStats: { completed: 3, total: 4 },
  });

  const [projects] = useState([
    { id: 1, title: '동아리 프로젝트', role: 'PM', startDate: '2025-03-20', endDate: null, score: null },
    { id: 2, title: 'WAP 해커톤', role: 'FE', startDate: '2025-03-20', endDate: '2025-07-20', score: 4.7 },
  ]);

  const [manualProjects] = useState([]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${y}.${m}.${d}`;
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setNewProjectName('');
    setNewStartDate('');
    setNewEndDate('');
    setIsAllDay(true);
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">
        <span style={{ color: '#FF6600' }}>{userInfo.name}</span> 님 프로필
      </h1>

      <section className="profile-main-card">
        {/* 상단: 아바타+이름 / 태스크 */}
        <div className="profile-header-row">
          <div className="profile-user-info">
            <Avatar alt="프로필" size="lg" />
            <div className="profile-name-block">
              <h2 className="user-name-text">{userInfo.name}</h2>
            </div>
          </div>
          <div className="user-task-display">
            <span className="task-stats-num">
              <span className="task-stats-completed">{userInfo.taskStats.completed}</span>
              <span className="task-stats-total">/{userInfo.taskStats.total}</span>
            </span>
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
                    <div className="proj-name-group">
                      <span className="proj-title">{proj.title}</span>
                      <span className="proj-role">{proj.role}</span>
                    </div>
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
                  </div>
                </div>
              </div>
            ))}

            {isEditing && (
              <button className="proj-add-row-btn" onClick={() => setIsAddModalOpen(true)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="12" y1="5" x2="12" y2="19" stroke="#ABABAB" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="5" y1="12" x2="19" y2="12" stroke="#ABABAB" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="proj-add-text">프로젝트 추가하기</span>
              </button>
            )}
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-edit-cancel" onClick={() => setIsEditing(false)}>취소</button>
              <button className="btn-edit-complete">완료</button>
            </>
          ) : (
            <MainButton size="md" onClick={() => setIsEditing(true)}>수정하기</MainButton>
          )}
        </div>
      </section>

      {isAddModalOpen && (
        <>
          <div className="modal-overlay" onClick={handleCloseModal} />
          <div className="modal-container">
            <div className="modal-inner">

              <h3 className="modal-title">프로젝트 추가</h3>

              {/* 프로젝트 이름 */}
              <div className="modal-field">
                <label className="modal-field-label">프로젝트 이름</label>
                <input
                  className="modal-input"
                  placeholder="이름을 적어주세요."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label className="modal-field-label">참여했던 직무</label>

               
                <div className="modal-date-row">
                  <span className="modal-row-label">시작</span>
                  <input
                    type="date"
                    className="modal-date-input"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className="modal-time-input"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    disabled={isAllDay}
                  />
                </div>

                <div className="modal-date-row">
                  <span className="modal-row-label">종료</span>
                  <input
                    type="date"
                    className="modal-date-input"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className="modal-time-input"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    disabled={isAllDay}
                  />
                </div>

                <div className="modal-date-row">
                  <span className="modal-row-label">종일</span>
                  <div
                    className={`modal-switch ${isAllDay ? 'modal-switch--on' : 'modal-switch--off'}`}
                    onClick={() => setIsAllDay(!isAllDay)}
                  >
                    <div className="modal-switch-handle" />
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button className="modal-btn-cancel" onClick={handleCloseModal}>취소</button>
                <button className="modal-btn-add">프로젝트 추가</button>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
