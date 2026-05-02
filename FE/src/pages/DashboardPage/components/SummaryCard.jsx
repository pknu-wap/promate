import React, { useState } from 'react';
import moreIcon from '../../../assets/moreIcon.svg';
import './SummaryCard.css';

function SummaryCard({ title, count, items = [], showDot }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getDotColor = (date) => {
    if (!date) return '#80D366';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date.replace(/\./g, '-'));
    targetDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return '#FF7B7B';
    if (diffDays === 7) return '#FFD748';
    return '#80D366';
  };

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
            {items.map((item) => (
              <li key={item.id} className="summary-item">
                {showDot && (
                  <span 
                    className="item-dot" 
                    style={{ backgroundColor: getDotColor(item.date) }} 
                  ></span>
                )}
                <div className="item-text">
                  <span className="item-name">{item.title}</span>
                  <span className="item-date">마감일: {item.date}</span>
                </div>
              </li>
            ))}
          </ul>
          <button className="more-btn">
            더보기<img src={moreIcon} alt="moreIcon" />
          </button>
        </>
      )}
    </div>
  );
}

export default SummaryCard;