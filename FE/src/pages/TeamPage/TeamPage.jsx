import React, { useState, useEffect } from 'react';
import { ClipboardList, SquarePen, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Calendar from '../../components/Calendar/Calendar';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import moreIcon from '../../assets/moreIcon.svg';
import NewTaskModal from '../../components/NewTaskModal/NewTaskModal.jsx';
import { 
  getProjectMembers, 
  getProjectTasks, 
  getProjectPosts, 
  getPostDetail, 
  createProjectPost,
  updateProjectPost,
  deleteProjectPost,
  getTaskDetail,
  createProjectTask,
  updateProjectTask
} from '../../api/TeamPage';
import './TeamPage.css';

const projects = [
  { id: 1, title: '프로그래밍 팀플', dueDate: '2026.05.17', currentStep: 12, totalStep: 18 },
  { id: 2, title: 'WAP 프로젝트', dueDate: '2026.06.05', currentStep: 125, totalStep: 150 },
  { id: 3, title: '캡스톤 디자인', dueDate: '2026.07.07', currentStep: 51, totalStep: 100 },
  { id: 4, title: '알고리즘 스터디', dueDate: '2023.05.10', currentStep: 93, totalStep: 100 },
  { id: 5, title: '인공지능 개발', dueDate: '2026.12.05', currentStep: 0, totalStep: 0 },
];

const INITIAL_VISIBLE_COUNT = 3;

function TeamPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [projectProgress, setProjectProgress] = useState(0);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDetailLoading, setIsTaskDetailLoading] = useState(false);
  const [taskDetailError, setTaskDetailError] = useState(null);

  const [members, setMembers] = useState([]);
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState(null);

  const [boardPosts, setBoardPosts] = useState([]);
  const [isBoardLoading, setIsBoardLoading] = useState(true);
  const [boardError, setBoardError] = useState(null);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isTaskExpanded, setIsTaskExpanded] = useState(false);
  const [isBoardExpanded, setIsBoardExpanded] = useState(false);
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isPostSubmitting, setIsPostSubmitting] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const projectData = projects.find((project) => project.id === Number(projectId)) ?? projects[0];
  const idToFetch = projectId ? Number(projectId) : projectData.id;
  
  const visibleTasks = isTaskExpanded ? tasks : tasks.slice(0, INITIAL_VISIBLE_COUNT);
  const visiblePosts = isBoardExpanded ? boardPosts : boardPosts.slice(0, INITIAL_VISIBLE_COUNT);
  const canToggleTasks = tasks.length > INITIAL_VISIBLE_COUNT;
  const canTogglePosts = boardPosts.length > INITIAL_VISIBLE_COUNT;

  const fetchTasks = async () => {
    try {
      setIsTasksLoading(true);
      setTasksError(null);
      const data = await getProjectTasks(idToFetch);
      setTasks(data.taskList || []);
      setProjectProgress(data.projectProgress || 0);
    } catch (err) {
      setTasksError(err.message);
    } finally {
      setIsTasksLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setIsBoardLoading(true);
      setBoardError(null);
      const data = await getProjectPosts(idToFetch);
      setBoardPosts(data.postList || []);
    } catch (err) {
      setBoardError(err.message);
    } finally {
      setIsBoardLoading(false);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsMembersLoading(true);
        setMembersError(null);
        const data = await getProjectMembers(idToFetch);
        setMembers(data);
      } catch (err) {
        setMembersError(err.message);
      } finally {
        setIsMembersLoading(false);
      }
    };

    fetchMembers();
  }, [idToFetch]);

  useEffect(() => {
    fetchTasks();
  }, [idToFetch]);

  useEffect(() => {
    fetchPosts();
  }, [idToFetch]);

  const handleTaskClick = async (taskId) => {
    try {
      setIsTaskDetailLoading(true);
      setTaskDetailError(null);
      setSelectedTask({ taskId });
      const data = await getTaskDetail(idToFetch, taskId);
      setSelectedTask(data);
    } catch (err) {
      setTaskDetailError(err.message);
    } finally {
      setIsTaskDetailLoading(false);
    }
  };

  const handleAddTaskSubmit = async (newTaskData) => {
    try {
      const formattedDate = newTaskData.dueDate.replace(/\./g, '-');
      await createProjectTask(idToFetch, {
        managerId: newTaskData.managerId,
        title: newTaskData.title,
        description: newTaskData.description || '',
        dueDate: formattedDate,
      });
      setIsNewTaskModalOpen(false);
      await fetchTasks();
    } catch (err) {
      alert(`테스크 생성에 실패했습니다: ${err.message}`);
    }
  };

  const handleUpdateTaskStatus = async (taskId, currentTask, nextStatus) => {
    try {
      await updateProjectTask(idToFetch, taskId, {
        role: currentTask.role,
        managerId: currentTask.managerId,
        description: currentTask.description,
        dueDate: currentTask.dueDate,
        status: nextStatus
      });
      setSelectedTask((prev) => prev && prev.taskId === taskId ? { ...prev, status: nextStatus } : prev);
      await fetchTasks();
    } catch (err) {
      alert(`테스크 상태 변경에 실패했습니다: ${err.message}`);
    }
  };

  const handlePostClick = async (postId) => {
    try {
      setIsDetailLoading(true);
      setDetailError(null);
      setIsMenuOpen(false);
      setSelectedPost({ postId });
      const data = await getPostDetail(idToFetch, postId);
      setSelectedPost(data);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setPostTitle('');
    setPostContent('');
    setIsPostModalOpen(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedPost) return;
    setIsEditMode(true);
    setPostTitle(selectedPost.title);
    setPostContent(selectedPost.content);
    setIsMenuOpen(false);
    setIsPostModalOpen(true);
  };

  const handlePostSubmit = async () => {
    if (!postTitle.trim() || !postContent.trim() || isPostSubmitting) {
      return;
    }

    try {
      setIsPostSubmitting(true);
      if (isEditMode) {
        await updateProjectPost(idToFetch, selectedPost.postId, {
          title: postTitle.trim(),
          content: postContent.trim(),
          postType: selectedPost.postType || 'GENERAL'
        });
        setSelectedPost((prev) => ({
          ...prev,
          title: postTitle.trim(),
          content: postContent.trim()
        }));
      } else {
        await createProjectPost(idToFetch, {
          title: postTitle.trim(),
          content: postContent.trim(),
          postType: 'GENERAL'
        });
      }
      closePostModal();
      if (!isEditMode) closePostDetailModal();
      await fetchPosts();
    } catch (err) {
      alert(`게시글 처리에 실패했습니다: ${err.message}`);
    } finally {
      setIsPostSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      setIsDetailLoading(true);
      await deleteProjectPost(idToFetch, selectedPost.postId);
      closePostDetailModal();
      await fetchPosts();
    } catch (err) {
      alert(`게시글 삭제에 실패했습니다: ${err.message}`);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const openTaskBoard = (status) => {
    navigate(`/task-board?projectId=${projectData.id}&status=${status}`);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
    setPostTitle('');
    setPostContent('');
  };

  const closePostDetailModal = () => {
    setSelectedPost(null);
    setDetailError(null);
    setIsMenuOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yy}.${mm}.${dd}`;
  };

  return (
    <div className="team-page-container">
      <h1 className="team-page-title">{projectData.title}</h1>

      <div className={`team-page-grid ${isTaskExpanded ? 'team-task-expanded' : ''}`}>
        <section
          className="team-card team-progress-card team-card-clickable"
          role="button"
          tabIndex={0}
          onClick={() => openTaskBoard('progress')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openTaskBoard('progress');
            }
          }}
        >
          <div className="team-progress-header">
            <div>
              <h2>프로젝트 현황</h2>
              <p>마감일: 2026.03.17</p>
            </div>
            <strong>
              {projectProgress}<span>%</span>
            </strong>
          </div>
          <ProgressBar percent={projectProgress} />
        </section>

        <section className={`team-card team-task-board ${isTaskExpanded ? 'team-card-expanded' : ''}`}>
          <div className="team-task-header">
            <h2>테스크 보드</h2>
            <div>
              <strong className="team-task-count">
                {tasks.length}<span>개</span>
              </strong>
              <button
                type="button"
                className="team-board-write-button"
                onClick={() => setIsNewTaskModalOpen(true)}
              >
                <SquarePen size={12} />
                <span>테스크쓰기</span>
              </button>
            </div>
          </div>

          <div className="team-task-list">
            {isTasksLoading && <div className="team-member-status">불러오는 중...</div>}
            {tasksError && <div className="team-member-status" style={{ color: 'red' }}>{tasksError}</div>}
            
            {!isTasksLoading && !tasksError && tasks.length === 0 && (
              <div className="team-member-status">등록된 테스크가 없습니다.</div>
            )}

            {!isTasksLoading && !tasksError && visibleTasks.map((task) => (
              <article 
                className="team-task-item" 
                key={task.taskId}
                role="button"
                tabIndex={0}
                onClick={() => handleTaskClick(task.taskId)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleTaskClick(task.taskId);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <h3>{task.title}</h3>
                  <p>마감일: {task.dueDate?.replace(/-/g, '.')}</p>
                </div>
                <span>{task.status}</span>
              </article>
            ))}
          </div>

          {canToggleTasks && (
            <MoreButton
              isExpanded={isTaskExpanded}
              onClick={() => setIsTaskExpanded((expanded) => !expanded)}
            />
          )}
        </section>

        <div className="team-card team-metric-card team-metric-card-urgent">
          <SummaryCard title="마감 임박 테스크" count={12} />
        </div>
        <div className="team-card team-metric-card team-metric-card-completed">
          <SummaryCard title="완료한 테스크" count={18} onHeaderClick={() => openTaskBoard('done')} />
        </div>

        <div className="team-calendar">
          <Calendar />
        </div>

        <section className="team-card team-members-card">
          <PanelTitle icon={<Users size={18} />} title="프로젝트 팀원" />
          <div className="team-members-list">
            {isMembersLoading && <div className="team-member-status">불러오는 중...</div>}
            {membersError && <div className="team-member-status" style={{ color: 'red' }}>{membersError}</div>}
            
            {!isMembersLoading && !membersError && members.length === 0 && (
              <div className="team-member-status">참여 중인 팀원이 없습니다.</div>
            )}

            {!isMembersLoading && !membersError && members.map((member) => (
              <div className="team-member" key={member.userId}>
                <strong>{member.name}</strong>
                <span>{member.role || '팀원'}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`team-card team-board-card ${isBoardExpanded ? 'team-card-expanded' : ''}`}>
          <div className="team-board-header">
            <PanelTitle icon={<ClipboardList size={18} />} title="게시판" />
            <button
              type="button"
              className="team-board-write-button"
              onClick={handleOpenCreateModal}
            >
              <SquarePen size={12} />
              <span>글쓰기</span>
            </button>
          </div>
          <div className="team-board-list">
            {isBoardLoading && <div className="team-member-status">불러오는 중...</div>}
            {boardError && <div className="team-member-status" style={{ color: 'red' }}>{boardError}</div>}
            
            {!isBoardLoading && !boardError && boardPosts.length === 0 && (
              <div className="team-member-status">등록된 게시글이 없습니다.</div>
            )}

            {!isBoardLoading && !boardError && visiblePosts.map((post) => (
              <article
                className="team-board-post"
                key={post.postId}
                role="button"
                tabIndex={0}
                onClick={() => handlePostClick(post.postId)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handlePostClick(post.postId);
                  }
                }}
              >
                <h3>{post.title}</h3>
                <time>{formatDate(post.createdAt)}</time>
              </article>
            ))}
          </div>
          {canTogglePosts && (
            <MoreButton
              isExpanded={isBoardExpanded}
              onClick={() => setIsBoardExpanded((expanded) => !expanded)}
            />
          )}
        </section>
      </div>

      {isPostModalOpen && (
        <div className="team-post-modal-backdrop" role="presentation" onMouseDown={closePostModal}>
          <div
            className="team-post-modal"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2>{isEditMode ? '게시글 수정' : '게시글 쓰기'}</h2>

            <label className="team-post-field">
              <span>제목</span>
              <input
                type="text"
                value={postTitle}
                onChange={(event) => setPostTitle(event.target.value)}
                placeholder="제목을 적어주세요."
                disabled={isPostSubmitting}
              />
            </label>

            <label className="team-post-field">
              <span>내용</span>
              <textarea
                value={postContent}
                onChange={(event) => setPostContent(event.target.value)}
                placeholder="내용을 적어주세요."
                disabled={isPostSubmitting}
              />
            </label>

            <div className="team-post-modal-actions">
              <button 
                type="button" 
                className="team-post-cancel-button" 
                onClick={closePostModal}
                disabled={isPostSubmitting}
              >
                취소
              </button>
              <button
                type="button"
                className="team-post-create-button"
                onClick={handlePostSubmit}
                disabled={!postTitle.trim() || !postContent.trim() || isPostSubmitting}
              >
                {isPostSubmitting ? '저장 중...' : isEditMode ? '수정 완료' : '게시글 생성'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPost && (
        <div className="team-post-detail-backdrop" role="presentation" onMouseDown={closePostDetailModal}>
          <article
            className="team-post-detail-modal"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="team-post-detail-menu-container" style={{ position: 'absolute', top: '20px', right: '20px' }}>
              <button
                type="button"
                className="team-post-detail-menu"
                aria-label="게시글 메뉴"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                ...
              </button>
              {isMenuOpen && (
                <div className="team-post-dropdown" style={{ position: 'absolute', right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 10 }}>
                  <button type="button" onClick={handleOpenEditModal} style={{ display: 'block', width: '100%', padding: '8px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>수정</button>
                  <button type="button" onClick={handleDeletePost} style={{ display: 'block', width: '100%', padding: '8px 16px', border: 'none', background: 'none', textAlign: 'left', color: 'red', cursor: 'pointer' }}>삭제</button>
                </div>
              )}
            </div>

            {isDetailLoading && <div className="team-member-status">처리 중...</div>}
            {detailError && <div className="team-member-status" style={{ color: 'red' }}>{detailError}</div>}

            {!isDetailLoading && !detailError && selectedPost.title && (
              <>
                <h2 id="team-post-detail-title">{selectedPost.title}</h2>
                <dl className="team-post-detail-meta">
                  <dt>작성자</dt>
                  <dd>{selectedPost.writerName}</dd>
                </dl>
                <p>{selectedPost.content}</p>
              </>
            )}
          </article>
        </div>
      )}

      {selectedTask && (
        <div className="team-post-detail-backdrop" role="presentation" onMouseDown={() => setSelectedTask(null)}>
          <article className="team-post-detail-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            {isTaskDetailLoading && <div className="team-member-status">태스크 정보 불러오는 중...</div>}
            {taskDetailError && <div className="team-member-status" style={{ color: 'red' }}>{taskDetailError}</div>}
            
            {!isTaskDetailLoading && !taskDetailError && selectedTask.title && (
              <>
                <h2>{selectedTask.title}</h2>
                <dl className="team-post-detail-meta" style={{ marginTop: '12px' }}>
                  <dt>담당자</dt>
                  <dd>{selectedTask.managerName} ({selectedTask.role || '역할 지정 없음'})</dd>
                  <dt>마감일</dt>
                  <dd>{selectedTask.dueDate}</dd>
                  <dt>상태</dt>
                  <dd>
                    <select 
                      value={selectedTask.status} 
                      onChange={(e) => handleUpdateTaskStatus(selectedTask.taskId, selectedTask, e.target.value)}
                      style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </dd>
                </dl>
                <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                  <p>{selectedTask.description || '상세 설명이 없습니다.'}</p>
                </div>
                <div className="team-post-modal-actions" style={{ marginTop: '24px', justifyContent: 'flex-end' }}>
                  <button type="button" className="team-post-cancel-button" onClick={() => setSelectedTask(null)}>닫기</button>
                </div>
              </>
            )}
          </article>
        </div>
      )}

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSubmit={handleAddTaskSubmit}
        projectId={idToFetch}
      />
    </div>
  );
}

function MoreButton({ isExpanded, onClick }) {
  return (
    <button className="team-more-button" type="button" aria-expanded={isExpanded} onClick={onClick}>
      <span>{isExpanded ? '접기' : '더보기'}</span>
      <img src={moreIcon} alt="" aria-hidden="true" />
    </button>
  );
}

function PanelTitle({ icon, title }) {
  return (
    <div className="team-panel-title">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

export default TeamPage;