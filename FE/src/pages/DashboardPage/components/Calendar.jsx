import React, { useMemo, useState } from 'react';
import './Calendar.css';
import calendarIcon from '../../../assets/CalendarIcon.svg';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

const initialEvents = [
  {
    id: 1,
    text: '회의',
    start: new Date(currentYear, currentMonth, 6),
    end: new Date(currentYear, currentMonth, 6),
    checked: false,
  },
  {
    id: 2,
    text: '왑 중간 발표',
    start: new Date(currentYear, currentMonth, 6),
    end: new Date(currentYear, currentMonth, 7),
    checked: true,
  },
  {
    id: 3,
    text: '왑 부스팅 데이',
    start: new Date(currentYear, currentMonth, 9),
    end: new Date(currentYear, currentMonth, 9),
    checked: false,
  },
  {
    id: 4,
    text: '대동제',
    start: new Date(currentYear, currentMonth, 12),
    end: new Date(currentYear, currentMonth, 14),
    checked: false,
  },
  {
    id: 5,
    text: '왑 홈커밍 데이',
    start: new Date(currentYear, currentMonth, 16),
    end: new Date(currentYear, currentMonth, 16),
    checked: false,
  },
];

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(initialEvents);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  const visibleEvents = useMemo(
    () => getVisibleEvents(events, year, month),
    [events, year, month]
  );

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToggleTodo = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, checked: !event.checked } : event
      )
    );
  };

  return (
    <section className="calendar-section">
      <div className="calendar-header-row">
        <div className="calendar-title-group">
          <img
            className="calendar-icon"
            src={calendarIcon}
            alt="캘린더 아이콘"
          />
          <h2 className="calendar-title">캘린더</h2>
        </div>

        <div className="calendar-nav">
          <button className="nav-btn" type="button" onClick={handlePrevMonth}>
            &lt;
          </button>

          <span className="nav-date">
            {year}.{String(month + 1).padStart(2, '0')}
          </span>

          <button className="nav-btn" type="button" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>
      </div>

      <div className="calendar-body">
        <div className="calendar-main">
          <div className="calendar-weekdays">
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className={`weekday ${index === 0 ? 'sun' : ''} ${
                  index === 6 ? 'sat' : ''
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map((day, index) => {
              const dayEvents = day
                ? getEventsByDay(events, year, month, day)
                : [];

              const hasStartEvent = dayEvents.some((event) =>
                isEventSegmentStart(event, year, month, day, index)
              );

              const hasSpanningEventStart = dayEvents.some((event) => {
                const isSegmentStart = isEventSegmentStart(
                  event,
                  year,
                  month,
                  day,
                  index
                );

                const eventSpan = getEventSpan(
                  event,
                  year,
                  month,
                  day,
                  index
                );

                return isSegmentStart && eventSpan > 1;
              });

              return (
                <div
                  key={`calendar-cell-${index}`}
                  className={`calendar-cell ${!day ? 'empty' : ''} ${
                    hasStartEvent ? 'has-event-start' : ''
                  } ${
                    hasSpanningEventStart ? 'has-spanning-event-start' : ''
                  }`}
                >
                  {day && <span className="day-number">{day}</span>}

                  {dayEvents.map((event) => {
                    const isSegmentStart = isEventSegmentStart(
                      event,
                      year,
                      month,
                      day,
                      index
                    );

                    const eventSpan = getEventSpan(
                      event,
                      year,
                      month,
                      day,
                      index
                    );

                    return (
                      <div
                        key={`${event.id}-${index}`}
                        className={`calendar-event ${
                          !isSegmentStart ? 'continued' : ''
                        }`}
                        style={
                          isSegmentStart
                            ? {
                                // 이어지는 일정은 시작 칸에서만 너비를 확장
                                width: `calc(${eventSpan * 100}% + ${
                                  eventSpan - 1
                                }px)`,
                              }
                            : undefined
                        }
                      >
                        {isSegmentStart ? event.text : ''}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="calendar-sidebar">
          <div className="calendar-todo-list">
            {visibleEvents.map((event) => (
              <button
                key={event.id}
                className="todo-item"
                type="button"
                onClick={() => handleToggleTodo(event.id)}
              >
                <span
                  className={`todo-checkbox ${
                    event.checked ? 'checked' : ''
                  }`}
                >
                  {event.checked && (
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 3L3 5L7 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                <span className="todo-text">{event.text}</span>
              </button>
            ))}
          </div>

          <button className="add-event-btn" type="button">
            + 일정 추가
          </button>
        </aside>
      </div>
    </section>
  );
}

function getCalendarDays(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const remainder = days.length % 7;

  if (remainder === 0) {
    return days;
  }

  // 마지막 주도 7칸 구조를 유지하도록 빈 칸을 추가
  return [...days, ...Array(7 - remainder).fill(null)];
}

function getEventsByDay(events, year, month, day) {
  const currentDate = new Date(year, month, day).getTime();

  return events
    .filter(
      (event) =>
        currentDate >= event.start.getTime() &&
        currentDate <= event.end.getTime()
    )
    .sort((a, b) => {
      const aDuration = a.end.getTime() - a.start.getTime();
      const bDuration = b.end.getTime() - b.start.getTime();

      // 긴 일정이 위에 오도록 정렬
      if (aDuration !== bDuration) {
        return bDuration - aDuration;
      }

      const startDiff = a.start.getTime() - b.start.getTime();

      if (startDiff !== 0) {
        return startDiff;
      }

      return a.id - b.id;
    });
}

function isEventSegmentStart(event, year, month, day, index) {
  const currentDate = new Date(year, month, day).getTime();

  // 일정 시작일이 아니어도 월 첫날이나 주 첫날이면 새 구간으로 다시 표시
  return (
    currentDate === event.start.getTime() ||
    day === 1 ||
    index % 7 === 0
  );
}

function getEventSpan(event, year, month, day, index) {
  const currentDate = new Date(year, month, day).getTime();

  if (
    currentDate !== event.start.getTime() &&
    day !== 1 &&
    index % 7 !== 0
  ) {
    return 1;
  }

  const daysUntilWeekEnd = 7 - (index % 7);
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  const eventEndDay =
    event.end.getFullYear() === year && event.end.getMonth() === month
      ? event.end.getDate()
      : lastDayOfMonth;

  const remainingEventDays = eventEndDay - day + 1;

  // 일정이 현재 주 안에서 차지할 칸 수만 계산
  return Math.min(daysUntilWeekEnd, remainingEventDays);
}

function getVisibleEvents(events, year, month) {
  const monthStart = new Date(year, month, 1).getTime();
  const monthEnd = new Date(year, month + 1, 0).getTime();

  return events
    .filter(
      (event) =>
        event.start.getTime() <= monthEnd && event.end.getTime() >= monthStart
    )
    .sort((a, b) => {
      const startDiff = a.start.getTime() - b.start.getTime();

      if (startDiff !== 0) {
        return startDiff;
      }

      return a.id - b.id;
    });
}

export default Calendar;