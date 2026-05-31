import React from 'react';
import './Tag.css';

function Tag({ children, isActive = false, hideInactiveOnMobile = false, onClick, className = '' }) {
  return (
    <span
      className={`common-tag ${isActive ? 'active' : ''} ${hideInactiveOnMobile ? 'hide-inactive' : ''} ${className}`.trim()}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </span>
  );
}

export default Tag;