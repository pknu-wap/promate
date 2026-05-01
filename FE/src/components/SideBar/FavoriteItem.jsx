import React from 'react';

function FavoriteItem({ name, dueDate, dotColor }) {
  return (
    <li className="favorite-list-item">
      <div className="favorite-item-header">
        <span className={`dot ${dotColor}`}></span> 
        {name}
      </div>
      <span className="date">마감일: {dueDate}</span>
    </li>
  );
}

export default FavoriteItem;