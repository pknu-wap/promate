import React, { useState } from 'react';
import './Calendar.css';
import calendarIcon from '../../../assets/CalendarIcon.svg';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 현재 월의 총 일수와 시작 요일 계산
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 달력 그리드 배열 생성
  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // 시작일 이전의 빈 칸
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="calendar-section">
      <div className="calendar-header-row">
        <div className="calendar-title-group">
          <span className="icon-calendar">
            <img src={calendarIcon} alt="캘린더 아이콘" />
          </span>
          <h2 className="calendar-title">캘린더</h2>
        </div>

        <div className="calendar-nav">
          <button className="nav-btn" onClick={handlePrevMonth}>
            &lt;
          </button>

          <span className="nav-date">
            {`${year}.${String(month + 1).padStart(2, '0')}`}
          </span>

          <button className="nav-btn" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>
      </div>

      <div className="calendar-body">
        <div className="calendar-weekdays">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`weekday ${
                index === 0 ? 'sun' : index === 6 ? 'sat' : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((day, index) => {
            const isWeekend = index % 7 === 0 || index % 7 === 6;

            return (
              <div
                key={index}
                className={`calendar-cell ${isWeekend ? 'weekend' : ''} ${
                  !day ? 'empty' : ''
                }`}
              >
                {day && <span className="day-number">{day}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;