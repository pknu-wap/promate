import React from 'react';
import { Link } from 'react-router-dom';

function FavoriteItem({ id, name, dueDate, dotColor, onClick }) {
  return (
    <li className="favorite-list-item">
      <Link to={`/projects/${id}`} className="favorite-item-link" onClick={onClick}>
        <div className="favorite-item-header">
          <span className={`dot ${dotColor}`}></span> 
          {name}
        </div>
        <span className="date">마감일: {dueDate}</span>
      </Link>
    </li>
  );
}

export default FavoriteItem;