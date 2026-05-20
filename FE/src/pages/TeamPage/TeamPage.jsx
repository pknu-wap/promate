import React from 'react';
import { ClipboardList, Users } from 'lucide-react';
import Calendar from '../../components/Calendar/Calendar';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import moreIcon from '../../assets/moreIcon.svg';
import './TeamPage.css';

const teamTasks = [
  { id: 1, title: '시장조사', dueDate: '2026.03.17' },
  { id: 2, title: 'PPT 발표 준비', dueDate: '2026.03.31' },
  { id: 3, title: '와이어 프레임', dueDate: '2026.04.01' },
];

const members = [
  { id: 1, name: '홍길동', role: 'PM' },
  { id: 2, name: '김철수', role: 'UIUX' },
  { id: 3, name: '김영희', role: 'FE' },
  { id: 4, name: '김영희', role: 'FE' },
];

const boardPosts = [
  { id: 1, title: '3차 정기회의', date: '26.02.09' },
  { id: 2, title: '3차 정기회의', date: '26.02.09' },
  { id: 3, title: '3차 정기회의', date: '26.02.09' },
];

function TeamPage() {
  return (
    <div className="team-page-container">
      <h1 className="team-page-title">캠스톤 디자인</h1>

      <div className="team-page-grid">
        <section className="team-card team-progress-card">
          <div className="team-progress-header">
            <div>
              <h2>프로젝트 현황</h2>
              <p>마감일: 2026.03.17</p>
            </div>
            <strong>
              75<span>%</span>
            </strong>
          </div>
          <ProgressBar percent={75} />
        </section>

        <section className="team-card team-task-board">
          <div className="team-task-header">
            <h2>테스크 보드</h2>
            <strong>
              12<span>개</span>
            </strong>
          </div>

          <div className="team-task-list">
            {teamTasks.map((task) => (
              <article className="team-task-item" key={task.id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>마감일: {task.dueDate}</p>
                </div>
                <span>여유</span>
              </article>
            ))}
          </div>

          <MoreButton />
        </section>

        <MetricCard title="마감 임박 테스크" count={12} />
        <MetricCard title="완료한 테스크" count={18} />

        <div className="team-calendar">
          <Calendar />
        </div>

        <section className="team-card team-members-card">
          <PanelTitle icon={<Users size={18} />} title="프로젝트 팀원" />
          <div className="team-members-list">
            {members.map((member) => (
              <div className="team-member" key={member.id}>
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="team-card team-board-card">
          <PanelTitle icon={<ClipboardList size={18} />} title="게시판" />
          <div className="team-board-list">
            {boardPosts.map((post) => (
              <article className="team-board-post" key={post.id}>
                <h3>{post.title}</h3>
                <time>{post.date}</time>
              </article>
            ))}
          </div>
          <MoreButton />
        </section>
      </div>
    </div>
  );
}

function MoreButton() {
  return (
    <button className="team-more-button" type="button">
      <span>더보기</span>
      <img src={moreIcon} alt="" aria-hidden="true" />
    </button>
  );
}

function MetricCard({ title, count }) {
  return (
    <section className="team-card team-metric-card">
      <h2>{title}</h2>
      <strong>
        {count}<span>개</span>
      </strong>
    </section>
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
