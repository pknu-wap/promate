import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moreIcon from '../../../assets/moreIcon.svg';
import './SummaryCard.css';
import { getDiffDays } from '../components/DateUtils';

function SummaryCard({ title, count, items = [], showDot }) {
  const [isExpanded, setIsExpanded] = useState(() => window.innerWidth > 768);
  const [visibleCount, setVisibleCount] = useState(3);
  
  const navigate = useNavigate();

  //카드 헤더 클릭 시 리스트를 접거나 펼쳐짐, 접을 때 표시 개수를 초기값으로 리셋
  const toggleExpand = () => {
    setIsExpanded((prevIsExpanded) => {
      if (prevIsExpanded) {
        setVisibleCount(3);
      }

      return !prevIsExpanded;
    });
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  const getDotColor = (date) => {
    if (!date) return '#80D366';

    const diffDays = getDiffDays(date);

    if (diffDays < 7) return '#FF7B7B';
    if (diffDays === 7) return '#FFD748';
    return '#80D366';
  };

  const visibleItems = items.slice(0, visibleCount);

  return (
    <div className={`summary-card ${isExpanded ? '' : 'collapsed'}`}>
      <div className="summary-header" onClick={toggleExpand}>
        <h3 className="summary-title">{title}</h3>
        <div className="summary-count">
          <span className="count-number">{count}</span>개
        </div>
      </div>

      {isExpanded && (
        <>
          <ul className="summary-list">
            {visibleItems.map((item) => (
              <li 
                key={item.id} 
                className="summary-item"
                onClick={() => navigate(`/project/${item.id}`)}
              >
                {showDot && (
                  <span
                    className="item-dot"
                    style={{ backgroundColor: getDotColor(item.dueDate) }}
                  />
                )}

                <div className="item-text">
                  <span className="item-name">{item.title}</span>
                  <span className="item-date">마감일: {item.dueDate}</span>
                </div>
              </li>
            ))}
          </ul>

          {visibleCount < items.length ? (
            <button className="more-btn" onClick={handleShowMore}>
              더보기
              <img src={moreIcon} alt="moreIcon" />
            </button>
          ) : items.length > 3 ? (
            <button className="more-btn" onClick={() => setVisibleCount(3)}>
              접기
              <img
                src={moreIcon}
                alt="moreIcon"
                style={{ transform: 'rotate(180deg)' }}
              />
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

export default SummaryCard;