import React, { useMemo, useState } from 'react';
import './TaskBoard.css';

const taskTabs = [
  { key: 'all', label: '전체' },
  { key: 'progress', label: '진행중인 태스크' },
  { key: 'done', label: '완료된 태스크' }
];

const initialTasks = [
  { id: 1, title: '메인 페이지 개발', dueDate: '2026.03.17', status: 'progress' },
  { id: 2, title: '프로토타입 테스트', dueDate: '2026.03.17', status: 'progress' },
  { id: 3, title: '중간 발표 준비', dueDate: '2026.03.17', status: 'done' },
  { id: 4, title: '중간 발표 준비', dueDate: '2026.03.17', status: 'progress' },
  { id: 5, title: '중간 발표 준비', dueDate: '2026.03.17', status: 'cancelled' },
  { id: 6, title: '중간 발표 준비', dueDate: '2026.03.17', status: 'progress' },
  { id: 7, title: '중간 발표 준비', dueDate: '2026.03.17', status: 'progress' }
];

function TaskBoard() {
  const [activeTab, setActiveTab] = useState('all');
  const [tasks, setTasks] = useState(initialTasks);

  const filteredTasks = useMemo(() => {
    const visibleTasks = tasks.filter((task) => task.status !== 'cancelled');

    if (activeTab === 'all') {
      return visibleTasks;
    }

    return visibleTasks.filter((task) => task.status === activeTab);
  }, [activeTab, tasks]);

  const updateTaskStatus = (taskId, status) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  const getStatusLabel = (status) => {
    if (status === 'done') {
      return '완료';
    }

    return '진행중';
  };

  return (
    <section className="task-board" aria-labelledby="task-board-title">
      <div className="task-board__content">
        <h1 id="task-board-title" className="task-board__title">
          캡스톤 디자인 - 태스크 보드
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
          {filteredTasks.map((task) => (
            <article key={task.id} className="task-board__card">
              <div className="task-board__task-info">
                <h2 className="task-board__task-title">{task.title}</h2>
                <p className="task-board__task-date">마감일: {task.dueDate}</p>
              </div>

              {task.status === 'progress' ? (
                <div className="task-board__actions" aria-label={`${task.title} 상태 변경`}>
                  <button
                    type="button"
                    className="task-board__action-button task-board__action-button--cancel"
                    onClick={() => updateTaskStatus(task.id, 'cancelled')}
                  >
                    취소하기
                  </button>
                  <button
                    type="button"
                    className="task-board__action-button task-board__action-button--complete"
                    onClick={() => updateTaskStatus(task.id, 'done')}
                  >
                    완료
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
