import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainButton from '../../components/MainButton/MainButton';
import Avatar from '../../components/Avatar/Avatar';
import AddProjectModal from './components/AddProjectModal';
import './ProfilePage.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    setUserInfo({ name: '김아무개', taskStats: { completed: 3, total: 5 } });
    setProjects([
      { id: 1, title: '동아리 프로젝트', role: 'PM', startDate: '2025-03-20', endDate: null, score: null, isManual: false },
      { id: 2, title: 'WAP 해커톤', role: 'FE', startDate: '2025-03-20', endDate: '2025-07-20', score: 4.7, isManual: false },
    ]);

    // TODO: 백엔드 연동 시 아래 코드로 교체
    // const fetchProfileData = async () => {
    //   try {
    //     const [userRes, taskRes, manualProjectRes, autoProjectRes] = await Promise.all([
    //       axios.get(`${BASE_URL}/user/me`),
    //       axios.get(`${BASE_URL}/user/me/projects/task-counts`),
    //       axios.get(`${BASE_URL}/user/me/projectHistories`),
    //       axios.get(`${BASE_URL}/projects/activity/me`),
    //     ]);
    //     const userData = userRes.data.data;
    //     const taskData = taskRes.data.data;
    //     const manualProjectsData = manualProjectRes.data.data || [];
    //     const autoProjectsData = autoProjectRes.data.data || [];
    //     setUserInfo({
    //       name: userData.name,
    //       taskStats: {
    //         completed: taskData.completedCount || 0,
    //         total: taskData.totalCount || 0,
    //       },
    //     });
    //     setProjects([
    //       ...autoProjectsData.map((p) => ({ ...p, isManual: false })),
    //       ...manualProjectsData.map((p) => ({ ...p, isManual: true })),
    //     ]);
    //   } catch (error) {
    //     console.error('프로필 데이터를 불러오는 중 오류 발생:', error);
    //   }
    // };
    // fetchProfileData();
  }, []);

  const handleAddProject = (newProject) => {
    setProjects((prev) => [...prev, { id: Date.now(), ...newProject, isManual: true }]);

    // TODO: 백엔드 연동 시 아래 코드로 교체
    // try {
    //   const res = await axios.post(`${BASE_URL}/user/me/projectHistories`, newProject);
    //   const added = res.data.data;
    //   setProjects((prev) => [...prev, { ...added, isManual: true }]);
    // } catch (error) {
    //   console.error('프로젝트 추가 중 오류 발생:', error);
    // }
  };

  const handleDeleteProject = (proj) => {
    if (!proj.isManual) return;
    setProjects((prev) => prev.filter((p) => p.id !== proj.id));

    // TODO: 백엔드 연동 시 아래 코드로 교체
    // try {
    //   await axios.delete(`${BASE_URL}/user/me/projectHistories/${proj.id}`);
    //   setProjects((prev) => prev.filter((p) => p.id !== proj.id));
    // } catch (error) {
    //   console.error('프로젝트 삭제 중 오류 발생:', error);
    // }
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">
        <span style={{ color: '#FF6600' }}>{userInfo.name}</span> 님 프로필
      </h1>

      <section className="profile-main-card">
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
