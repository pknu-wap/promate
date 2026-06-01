import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { getProjectTasks, updateTaskStatus, deleteProjectTask } from '../../api/TeamPage';
import './TaskBoard.css';

const taskTabs = [
  { key: 'all', label: '전체' },
  { key: 'IN_PROGRESS', label: '진행중인 태스크' },
  { key: 'DONE', label: '완료된 태스크' }
];

function TaskBoard() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const projectId = Number(searchParams.get('projectId'));
  
  const projectTitle = location.state?.projectTitle || '프로젝트';
  
  const initialTab = taskTabs.some((tab) => tab.key === searchParams.get('status'))
    ? searchParams.get('status')
    : 'all';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return;
      try {
        const data = await getProjectTasks(projectId);
        setTasks(data.taskList || []);
      } catch (error) {
        console.error("테스크 목록을 불러오는데 실패했습니다.", error);
      }
    };
    fetchTasks();
  }, [projectId]);

  const filteredTasks = useMemo(() => {
    const visibleTasks = tasks.filter((task) => task.status !== 'cancelled');

    if (activeTab === 'all') {
      return visibleTasks;
    }

    if (activeTab === 'IN_PROGRESS') {
      return visibleTasks.filter((task) => task.status === 'IN_PROGRESS' || task.status === 'TODO');
    }

    return visibleTasks.filter((task) => task.status === activeTab);
  }, [activeTab, tasks]);

  const handleCompleteTask = async (taskId) => {
    try {
      await updateTaskStatus(projectId, taskId, { status: 'DONE' });
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.taskId === taskId ? { ...task, status: 'DONE' } : task))
      );
    } catch (err) {
      alert(`테스크 완료 처리에 실패했습니다: ${err.message}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!projectId) return alert("프로젝트 ID가 유효하지 않습니다.");
    if (!window.confirm('정말로 이 테스크를 삭제하시겠습니까?')) return;
    
    try {
      await deleteProjectTask(projectId, taskId);
      setTasks((currentTasks) => currentTasks.filter((task) => task.taskId !== taskId));
    } catch (error) {
      alert(`테스크 삭제에 실패했습니다: ${error.message}`);
    }
  };

  const formatDate = (dateStr) => dateStr ? dateStr.replace(/-/g, '.') : '';

  const getStatusLabel = (status) => {
    if (status === 'DONE') {
      return '완료';
    }

    return '진행중';
  };

  return (
    <section className="task-board" aria-labelledby="task-board-title">
      <div className="task-board__content">
        <h1 id="task-board-title" className="task-board__title">
          {projectTitle} - 태스크 보드
        </h1>

        <div className="task-board__toolbar">
          <nav className="task-board__tabs" aria-label="태스크 상태 필터">
            {taskTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`task-board__tab ${activeTab === tab.key ? 'task-board__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button type="button" className="task-board__write-button">
            <span aria-hidden="true">✎</span>
            태스크 쓰기
          </button>
        </div>

        <div className="task-board__list" aria-label="태스크 목록">
        {filteredTasks.length === 0 ? <p style={{textAlign: 'center', marginTop: '20px'}}>등록된 태스크가 없습니다.</p> : filteredTasks.map((task) => (
          <article key={task.taskId} className="task-board__card">
              <div className="task-board__task-info">
                <h2 className="task-board__task-title">{task.title}</h2>
              <p className="task-board__task-date">마감일: {formatDate(task.dueDate)}</p>
              </div>

            {task.status === 'IN_PROGRESS' || task.status === 'TODO' ? (
                <div className="task-board__actions" aria-label={`${task.title} 상태 변경`}>
                  <button
                    type="button"
                    className="task-board__action-button task-board__action-button--cancel"
                  onClick={() => handleDeleteTask(task.taskId)}
                  >
                    삭제하기
                  </button>
                  <button
                    type="button"
                    className="task-board__action-button task-board__action-button--complete"
                  onClick={() => handleCompleteTask(task.taskId)}
                  >
                    완료하기
                  </button>
                </div>
              ) : (
                <span className={`task-board__status task-board__status--${task.status}`}>
                  {getStatusLabel(task.status)}
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TaskBoard;
