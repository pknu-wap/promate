import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { getProjectTasks, updateTaskStatus, deleteProjectTask, getProjectMembers, createProjectTask, getTaskDetail } from '../../api/TeamPage';
import NewTaskModal from '../../components/NewTaskModal/NewTaskModal.jsx';
import TaskDetailModal from '../TeamPage/components/TaskDetailModal.jsx';
import writeIcon from '../../assets/icons/writeIcon.svg';
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
  const [members, setMembers] = useState([]);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDetailLoading, setIsTaskDetailLoading] = useState(false);
  const [taskDetailError, setTaskDetailError] = useState(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      try {
        const taskData = await getProjectTasks(projectId);
        setTasks(taskData.taskList || []);
        const memberData = await getProjectMembers(projectId);
        setMembers(memberData || []);
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다.", error);
      }
    };
    fetchData();
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

  const handleTaskClick = async (taskId) => {
    try {
      setIsTaskDetailLoading(true);
      setTaskDetailError(null);
      setSelectedTask({ taskId });
      const data = await getTaskDetail(projectId, taskId);
      setSelectedTask(data);
    } catch (err) {
      setTaskDetailError(err.message);
    } finally {
      setIsTaskDetailLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, currentTask, nextStatus) => {
    try {
      await updateTaskStatus(projectId, taskId, { status: nextStatus });
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.taskId === taskId ? { ...task, status: nextStatus } : task))
      );
      setSelectedTask((prev) => prev && prev.taskId === taskId ? { ...prev, status: nextStatus } : prev);
    } catch (err) {
      alert(`테스크 상태 변경에 실패했습니다: ${err.message}`);
    }
  };

  const handleDeleteTask = async (taskId = selectedTask?.taskId) => {
    if (!projectId || !taskId) return alert("프로젝트 ID가 유효하지 않습니다.");
    if (!window.confirm('정말로 이 테스크를 삭제하시겠습니까?')) return;
    
    try {
      await deleteProjectTask(projectId, taskId);
      setTasks((currentTasks) => currentTasks.filter((task) => task.taskId !== taskId));
      if (selectedTask?.taskId === taskId) {
        setSelectedTask(null);
      }
    } catch (error) {
      alert(`테스크 삭제에 실패했습니다: ${error.message}`);
    }
  };

  const handleAddTaskSubmit = async (newTaskData) => {
    try {
      const formattedDate = newTaskData.dueDate.replace(/\./g, '-');
      await createProjectTask(projectId, {
        managerId: newTaskData.managerId,
        title: newTaskData.title,
        description: newTaskData.description || '',
        dueDate: formattedDate,
      });
      setIsNewTaskModalOpen(false);
      
      const data = await getProjectTasks(projectId);
      setTasks(data.taskList || []);
    } catch (err) {
      alert(`테스크 생성에 실패했습니다: ${err.message}`);
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

          <button
            type="button"
            className="task-board__write-button"
            onClick={() => setIsNewTaskModalOpen(true)}
          >
            <img src={writeIcon} alt="" aria-hidden="true" />
            태스크 쓰기
          </button>
        </div>

        <div className="task-board__list" aria-label="태스크 목록">
        {filteredTasks.length === 0 ? <p style={{textAlign: 'center', marginTop: '20px'}}>등록된 태스크가 없습니다.</p> : filteredTasks.map((task) => (
          <article 
            key={task.taskId} 
            className="task-board__card"
            role="button"
            tabIndex={0}
            onClick={() => handleTaskClick(task.taskId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTaskClick(task.taskId);
              }
            }}
          >
              <div className="task-board__task-info">
                <h2 className="task-board__task-title">{task.title}</h2>
              <p className="task-board__task-date">마감일: {formatDate(task.dueDate)}</p>
              </div>

            {task.status === 'IN_PROGRESS' || task.status === 'TODO' ? (
                <div className="task-board__actions" aria-label={`${task.title} 상태 변경`}>
                  <button
                    type="button"
                    className="task-board__action-button task-board__action-button--cancel"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(task.taskId);
                    }}
                  >
                    삭제하기
                  </button>
                  <button
                    type="button"
                    className="task-board__action-button task-board__action-button--complete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateTaskStatus(task.taskId, task, 'DONE');
                    }}
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

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSubmit={handleAddTaskSubmit}
        projectId={projectId}
        members={members}
      />

      <TaskDetailModal
        isOpen={!!selectedTask}
        task={selectedTask}
        isLoading={isTaskDetailLoading}
        error={taskDetailError}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleUpdateTaskStatus}
        onDelete={() => handleDeleteTask()}
      />
    </section>
  );
}

export default TaskBoard;
