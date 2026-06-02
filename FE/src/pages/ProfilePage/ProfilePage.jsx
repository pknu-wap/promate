import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/apiClient';
import MainButton from '../../components/MainButton/MainButton';
import Avatar from '../../components/Avatar/Avatar';
import AddProjectModal from './components/AddProjectModal';
import './ProfilePage.css';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [userInfo, setUserInfo] = useState({
    name: '로딩 중...',
    taskStats: { completed: 0, total: 0 },
  });

  const [projects, setProjects] = useState([]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${y}.${m}.${d}`;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const [userRes, taskRes, manualProjectRes, autoProjectRes] = await Promise.allSettled([
        apiClient.get('/user/me'),
        apiClient.get('/user/me/projects/task-counts'),
        apiClient.get('/user/me/projectHistories'),
        apiClient.get('/projects/activity/me'),
      ]);

      if (userRes.status === 'fulfilled') {
        const userData = userRes.value.data.data;
        const taskData = taskRes.status === 'fulfilled' ? taskRes.value.data.data : null;
        setUserInfo({
          name: userData.name,
          taskStats: {
            completed: taskData?.completedCount ?? userData.completedTaskCount ?? 0,
            total: taskData?.totalCount ?? userData.totalTaskCount ?? 0,
          },
        });
        setProfileImageUrl(userData.profileImageUrl || null);
      }

      const manualProjectsData = manualProjectRes.status === 'fulfilled'
        ? (manualProjectRes.value.data.data || []) : [];
      const autoProjectsData = autoProjectRes.status === 'fulfilled'
        ? (autoProjectRes.value.data.data || []) : [];

      setProjects([
        ...autoProjectsData.map((p) => ({ ...p, isManual: false })),
        ...manualProjectsData.map((p) => ({ ...p, isManual: true })),
      ]);
    };
    fetchProfileData();
  }, []);

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImageUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await apiClient.patch('/user/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = res.data.data;
      if (updated?.profileImageUrl) setProfileImageUrl(updated.profileImageUrl);
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
    }
  };

  const handleAddProject = async (newProject) => {
    try {
      const res = await apiClient.post('/user/me/projectHistories', newProject);
      const added = res.data.data;
      setProjects((prev) => [...prev, { ...added, isManual: true }]);
    } catch (error) {
      console.error('프로젝트 추가 중 오류 발생:', error);
    }
  };

  const handleDeleteProject = async (proj) => {
    if (!proj.isManual) return;
    const historyId = proj.historyId ?? proj.id;
    try {
      await apiClient.delete(`/user/me/projectHistories/${historyId}`);
      setProjects((prev) => prev.filter((p) => (p.historyId ?? p.id) !== historyId));
    } catch (error) {
      console.error('프로젝트 삭제 중 오류 발생:', error);
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">
        <span style={{ color: '#FF6600' }}>{userInfo.name}</span> 님 프로필
      </h1>

      <section className="profile-main-card">
        <div className="profile-header-row">
          <div className="profile-user-info">
            <div
              className={`profile-avatar-wrap${isEditing ? ' profile-avatar-wrap--editable' : ''}`}
              onClick={handleImageClick}
            >
              <Avatar src={profileImageUrl} alt="프로필" size="lg" />
              {isEditing && (
                <div className="profile-avatar-overlay">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
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

        <div className="form-field">
          <label className="form-label">프로젝트 경험</label>
          <div className="project-experience-list">
            {[...projects]
              .sort((a, b) => (a.endDate ? 1 : -1) - (b.endDate ? 1 : -1))
              .map((proj) => (
                <div key={proj.historyId ?? proj.id} className="project-experience-row">
                  <div className="proj-row-inner">
                    <div className="proj-name-group">
                      <span className="proj-title">{proj.title}</span>
                      {proj.role && <span className="proj-role">{proj.role}</span>}
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
                      {isEditing && proj.isManual && (
                        <button
                          className="proj-delete-btn"
                          onClick={() => handleDeleteProject(proj)}
                        >✕</button>
                      )}
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
              <button className="btn-edit-complete" onClick={() => setIsEditing(false)}>완료</button>
            </>
          ) : (
            <MainButton size="md" onClick={() => setIsEditing(true)}>수정하기</MainButton>
          )}
        </div>
      </section>

      {isAddModalOpen && (
        <AddProjectModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProject}
        />
      )}
    </div>
  );
};

export default ProfilePage;