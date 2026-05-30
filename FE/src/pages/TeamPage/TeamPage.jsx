import React, { useState } from 'react';
import { ClipboardList, SquarePen, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
  {
    id: 1,
    title: '3차 정기회의',
    date: '26.02.09',
    author: '김은비',
    content:
      '미래를 대비한 기술 학습의 중요성은 최신 기술 트렌드와 학습 방법을 다룹니다. 인공지능, 빅데이터, 블록체인 등 빠르게 발전하는 기술 분야에서 경쟁력을 유지하기 위해 지속적인 학습이 필요합니다. 온라인 강의, 워크숍, 세미나 등을 통해 최신 기술 동향을 파악하고 실무 능력을 향상시킬 수 있습니다. 또한, 프로젝트 기반 학습을 통해 실제 문제를 해결하는 경험을 쌓는 것이 중요합니다. 미래를 대비한 기술 학습은 개인의 경력 발전과 더불어 사회 전반의 혁신을 이끄는 데 기여할 수 있습니다.',
  },
  {
    id: 2,
    title: '기획서 피드백 공유',
    date: '26.02.16',
    author: '김은비',
    content:
      '기획서 피드백 내용을 공유합니다. 핵심 기능의 우선순위를 다시 정리하고, 사용자 흐름에서 불필요한 단계를 줄이는 방향으로 보완하면 좋겠습니다.',
  },
  {
    id: 3,
    title: '역할 분담 안내',
    date: '26.02.23',
    author: '김은비',
    content:
      '역할 분담 내용을 안내합니다. 각자 맡은 파트를 확인한 뒤 일정에 맞춰 진행 상황을 공유해주세요.',
  },
  {
    id: 4,
    title: '디자인 초안 확인',
    date: '26.03.02',
    author: '김은비',
    content:
      '디자인 초안이 업데이트되었습니다. 화면별 컴포넌트 배치와 색상 사용을 확인하고 수정 의견을 남겨주세요.',
  },
  {
    id: 5,
    title: '중간 점검 일정',
    date: '26.03.09',
    author: '김은비',
    content:
      '중간 점검 일정은 다음 회의에서 확정합니다. 현재 진행률과 막힌 부분을 미리 정리해주세요.',
  },
  {
    id: 6,
    title: '최종 제출 체크리스트',
    date: '26.03.16',
    author: '김은비',
    content:
      '최종 제출 전 체크리스트입니다. 발표 자료, 시연 영상, 문서 파일, 배포 링크를 모두 확인해주세요.',
  },
];

const INITIAL_VISIBLE_COUNT = 3;

function TeamPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);
  const [isBoardExpanded, setIsBoardExpanded] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const projectData = projects.find((project) => project.id === Number(projectId)) ?? projects[0];
  const visibleTasks = isTaskExpanded ? teamTasks : teamTasks.slice(0, INITIAL_VISIBLE_COUNT);
  const visiblePosts = isBoardExpanded ? boardPosts : boardPosts.slice(0, INITIAL_VISIBLE_COUNT);
  const canToggleTasks = teamTasks.length > INITIAL_VISIBLE_COUNT;
  const canTogglePosts = boardPosts.length > INITIAL_VISIBLE_COUNT;
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
  };
  const createPost = () => {
    if (!postTitle.trim() || !postContent.trim()) {
      return;
    }

    closePostModal();
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
          <SummaryCard title="완료한 테스크" count={18} onHeaderClick={() => openTaskBoard('done')} />
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
          <div className="team-board-header">
            <PanelTitle icon={<ClipboardList size={18} />} title="게시판" />
            <button
              type="button"
              className="team-board-write-button"
              onClick={() => setIsPostModalOpen(true)}
            >
              <SquarePen size={12} />
              <span>글쓰기</span>
            </button>
          </div>
          <div className="team-board-list">
            {visiblePosts.map((post) => (
              <article
                className="team-board-post"
                key={post.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPost(post)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedPost(post);
                  }
                }}
              >
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

      {isPostModalOpen && (
        <div className="team-post-modal-backdrop" role="presentation" onMouseDown={closePostModal}>
          <div
            className="team-post-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-post-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="team-post-modal-title">게시글 쓰기</h2>

            <label className="team-post-field">
              <span>제목</span>
              <input
                type="text"
                value={postTitle}
                onChange={(event) => setPostTitle(event.target.value)}
                placeholder="제목을 적어주세요."
              />
            </label>

            <label className="team-post-field">
              <span>내용</span>
              <textarea
                value={postContent}
                onChange={(event) => setPostContent(event.target.value)}
                placeholder="내용을 적어주세요."
              />
            </label>

            <div className="team-post-modal-actions">
              <button type="button" className="team-post-cancel-button" onClick={closePostModal}>
                취소
              </button>
              <button
                type="button"
                className="team-post-create-button"
                onClick={createPost}
                disabled={!postTitle.trim() || !postContent.trim()}
              >
                게시글 생성
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
            aria-labelledby="team-post-detail-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="team-post-detail-menu"
              aria-label="게시글 메뉴"
            >
              ...
            </button>

            <h2 id="team-post-detail-title">{selectedPost.title}</h2>
            <dl className="team-post-detail-meta">
              <dt>작성자</dt>
              <dd>{selectedPost.author}</dd>
            </dl>
            <p>{selectedPost.content}</p>
          </article>
        </div>
      )}
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
