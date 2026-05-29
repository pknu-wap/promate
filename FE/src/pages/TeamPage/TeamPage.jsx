import React, { useState } from 'react';
import { ClipboardList, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Calendar from '../../components/Calendar/Calendar';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import moreIcon from '../../assets/moreIcon.svg';
import './TeamPage.css';

const projects = [
  { id: 1, title: '프로그래밍 팀플', dueDate: '2026.05.17', currentStep: 12, totalStep: 18 },
  { id: 2, title: 'WAP 프로젝트', dueDate: '2026.06.05', currentStep: 125, totalStep: 150 },
  { id: 3, title: '캡스톤 디자인', dueDate: '2026.07.07', currentStep: 51, totalStep: 100 },
  { id: 4, title: '알고리즘 스터디', dueDate: '2023.05.10', currentStep: 93, totalStep: 100 },
  { id: 5, title: '인공지능 개발', dueDate: '2026.12.05', currentStep: 0, totalStep: 0 },
];

const teamTasks = [
  { id: 1, title: '시장조사', dueDate: '2026.03.17' },
  { id: 2, title: 'PPT 발표 준비', dueDate: '2026.03.31' },
  { id: 3, title: '와이어 프레임', dueDate: '2026.04.01' },
  { id: 4, title: '디자인 시스템 정리', dueDate: '2026.04.08' },
  { id: 5, title: 'API 명세 확인', dueDate: '2026.04.12' },
  { id: 6, title: '메인 화면 개발', dueDate: '2026.04.18' },
  { id: 7, title: '사용자 테스트 준비', dueDate: '2026.04.24' },
  { id: 8, title: '최종 발표 자료 검토', dueDate: '2026.04.30' },
];

const members = [
  { id: 1, name: '홍길동', role: 'PM' },
  { id: 2, name: '김철수', role: 'UIUX' },
  { id: 3, name: '김영희', role: 'FE' },
  { id: 4, name: '김영희', role: 'FE' },
];

const boardPosts = [
  { id: 1, title: '3차 정기회의', date: '26.02.09' },
  { id: 2, title: '기획서 피드백 공유', date: '26.02.16' },
  { id: 3, title: '역할 분담 안내', date: '26.02.23' },
  { id: 4, title: '디자인 초안 확인', date: '26.03.02' },
  { id: 5, title: '중간 점검 일정', date: '26.03.09' },
  { id: 6, title: '최종 제출 체크리스트', date: '26.03.16' },
];

const INITIAL_VISIBLE_COUNT = 3;

function TeamPage() {
  const { projectId } = useParams();
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);
  const [isBoardExpanded, setIsBoardExpanded] = useState(false);
  const projectData = projects.find((project) => project.id === Number(projectId)) ?? projects[0];
  const visibleTasks = isTaskExpanded ? teamTasks : teamTasks.slice(0, INITIAL_VISIBLE_COUNT);
  const visiblePosts = isBoardExpanded ? boardPosts : boardPosts.slice(0, INITIAL_VISIBLE_COUNT);
  const canToggleTasks = teamTasks.length > INITIAL_VISIBLE_COUNT;
  const canTogglePosts = boardPosts.length > INITIAL_VISIBLE_COUNT;

  return (
    <div className="team-page-container">
      <h1 className="team-page-title">{projectData.title}</h1>

      <div className={`team-page-grid ${isTaskExpanded ? 'team-task-expanded' : ''}`}>
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

        <section className={`team-card team-task-board ${isTaskExpanded ? 'team-card-expanded' : ''}`}>
          <div className="team-task-header">
            <h2>테스크 보드</h2>
            <strong>
              {teamTasks.length}<span>개</span>
            </strong>
          </div>

          <div className="team-task-list">
            {visibleTasks.map((task) => (
              <article className="team-task-item" key={task.id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>마감일: {task.dueDate}</p>
                </div>
                <span>여유</span>
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
          <SummaryCard title="완료한 테스크" count={18} />
        </div>

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

        <section className={`team-card team-board-card ${isBoardExpanded ? 'team-card-expanded' : ''}`}>
          <PanelTitle icon={<ClipboardList size={18} />} title="게시판" />
          <div className="team-board-list">
            {visiblePosts.map((post) => (
              <article className="team-board-post" key={post.id}>
                <h3>{post.title}</h3>
                <time>{post.date}</time>
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
