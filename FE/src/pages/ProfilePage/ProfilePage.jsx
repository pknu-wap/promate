import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import MainButton from '../../components/MainButton/MainButton';
import Avatar from '../../components/Avatar/Avatar';
import AddProjectModal from './components/AddProjectModal';
import './ProfilePage.css';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: '미지의 유저',
    taskStats: { completed: 0, total: 0 },
  });

  const [projects, setProjects] = useState([]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${y}.${m}.${d}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate(-1);
      return;
    }

    const fetchProfileData = async () => {
      const [userRes, taskCountsRes, manualProjectRes, ongoingProjectRes, completedProjectRes] = await Promise.allSettled([
        apiClient.get('/user/me'),
        apiClient.get('/user/me/projects/task-counts'),
        apiClient.get('/user/me/projectHistories'),
        apiClient.get('/projects/me'),
        apiClient.get('/projects/activity/me'),
      ]);

      if (userRes.status === 'fulfilled') {
        const userData = userRes.value.data.data;
        const taskCountsData = taskCountsRes.status === 'fulfilled'
          ? (taskCountsRes.value.data?.data ?? []) : [];

        const completed = taskCountsData.reduce((sum, p) => sum + (p.completedTaskCount ?? 0), 0);
        const total = taskCountsData.reduce((sum, p) => sum + (p.completedTaskCount ?? 0) + (p.incompleteTaskCount ?? 0), 0);

        setUserInfo({
          name: userData.name,
          taskStats: { completed, total },
        });
        setProfileImageUrl(userData.profileImageUrl || null);
      }

      const manualProjectsData = manualProjectRes.status === 'fulfilled'
        ? (manualProjectRes.value.data?.data || []) : [];

      const ongoingProjectsData = ongoingProjectRes.status === 'fulfilled'
        ? (ongoingProjectRes.value.data?.data ?? ongoingProjectRes.value.data ?? []) : [];

      const completedProjectsData = completedProjectRes.status === 'fulfilled'
        ? (completedProjectRes.value.data?.data ?? completedProjectRes.value.data ?? []) : [];

      setProjects([
        ...ongoingProjectsData.map((p) => ({
          ...p,
          title: p.projectName ?? p.title ?? p.name,
          startDate: p.startDate ?? p.projectStartDate ?? p.createdAt ?? null,
          endDate: null,
          score: p.averageReviewScore ?? p.score ?? null,
          isCompleted: false,
          isManual: false,
        })),
        ...completedProjectsData.map((p) => ({
          ...p,
          title: p.title,
          startDate: p.startDate ?? null,
          endDate: p.endDate ?? null,
          score: p.averageReviewScore ?? null,
          isCompleted: true,
          isManual: false,
        })),
        ...manualProjectsData.map((p) => ({
          ...p,
          title: p.projectName ?? p.title,
          isCompleted: p.status ? p.status === 'COMPLETED' : !!p.endDate,
          isManual: true,
          isEditable: p.editable ?? true,
        })),
      ]);
    };

    fetchProfileData();
  }, [navigate]);

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('2MB 이하 이미지만 업로드 가능합니다.');
      return;
    }

    const prevUrl = profileImageUrl;
    const dataUrl = await fileToBase64(file);
    setProfileImageUrl(dataUrl);

    try {
      const res = await apiClient.patch('/user/me', { profileImageBase64: dataUrl });
      const updated = res.data.data;
      if (updated?.profileImageUrl?.startsWith('http')) {
        setProfileImageUrl(updated.profileImageUrl);
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      setProfileImageUrl(prevUrl);
    }
  };

  const handleAddProject = async (newProject) => {
    try {
      const res = await apiClient.post('/user/me/projectHistories', newProject);
      const added = res.data.data;
      setProjects((prev) => [...prev, {
        ...added,
        title: added.projectName ?? added.title,
        isCompleted: added.status ? added.status === 'COMPLETED' : !!added.endDate,
        isManual: true,
        isEditable: added.editable ?? true,
      }]);
    } catch (error) {
      console.error('프로젝트 추가 중 오류 발생:', error);
    }
  };

  const handleEditProject = async (updatedProject) => {
    const historyId = editingProject.historyId ?? editingProject.id;
    try {
      const res = await apiClient.patch(`/user/me/projectHistories/${historyId}`, updatedProject);
      const updated = res.data.data;
      setProjects((prev) => prev.map((p) =>
        (p.historyId ?? p.id) === historyId
          ? {
              ...p,
              ...updated,
              title: updated.projectName ?? updated.title,
              isCompleted: updated.status ? updated.status === 'COMPLETED' : !!updated.endDate,
              isManual: true,
              isEditable: updated.editable ?? true
            }
          : p
      ));
    } catch (error) {
      console.error('프로젝트 수정 중 오류 발생:', error);
    } finally {
      setEditingProject(null);
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

  const handleEditComplete = async () => {
    setIsEditing(false);
    if (editName.trim() && editName !== userInfo.name) {
      try {
        const res = await apiClient.patch('/user/me', { name: editName.trim() });
        const updatedName = res.data?.data?.name || editName.trim();
        setUserInfo((prev) => ({ ...prev, name: updatedName }));
      } catch (error) {
        console.error('이름 수정 실패:', error);
        alert('이름 수정에 실패했습니다.');
      }
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
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="edit-name-input"
                />
              ) : (
                <h2 className="user-name-text">{userInfo.name}</h2>
              )}
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
              .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted))
              .map((proj) => (
                <div key={proj.historyId ?? proj.id ?? proj.projectId} className="project-experience-row">
                  <div className="proj-row-inner">
                    <div className="proj-name-group">
                      <span className="proj-title">{proj.title}</span>
                      {proj.role && <span className="proj-role">{proj.role}</span>}
                    </div>
                    <div className="proj-right-group">
                      <span className="proj-period">
                        {formatDate(proj.startDate)}
                        {proj.endDate ? ` ~ ${formatDate(proj.endDate)}` : ' ~'}
                      </span>
                      <span className={proj.isCompleted ? 'badge-completed' : 'badge-ongoing'}>
                        <span>{proj.isCompleted ? '완료' : '진행중'}</span>
                      </span>
                      <div className="proj-score-container">
                        {proj.score != null ? (
                          <>
                            <span className="proj-score-num">{Number(proj.score).toFixed(1)}</span>
                            <span className="proj-score-text">점</span>
                          </>
                        ) : (
                          <span style={{ width: 47 }} />
                        )}
                      </div>
                  {isEditing && proj.isManual && proj.isEditable && (
                        <>
                          <button
                            className="proj-delete-btn"
                            onClick={() => setEditingProject(proj)}
                          >✏</button>
                          <button
                            className="proj-delete-btn"
                            onClick={() => handleDeleteProject(proj)}
                          >✕</button>
                        </>
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
              <button className="btn-edit-complete" onClick={handleEditComplete}>완료</button>
            </>
          ) : (
            <MainButton size="md" onClick={() => { setIsEditing(true); setEditName(userInfo.name); }}>수정하기</MainButton>
          )}
        </div>
      </section>

      {isAddModalOpen && (
        <AddProjectModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProject}
        />
      )}

      {editingProject && (
        <AddProjectModal
          onClose={() => setEditingProject(null)}
          onAdd={handleEditProject}
          initialValues={{
            projectName: editingProject.title ?? editingProject.projectName ?? '',
            description: editingProject.description ?? '',
            role: editingProject.role ?? '',
            startDate: editingProject.startDate ?? '',
            endDate: editingProject.endDate ?? '',
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
