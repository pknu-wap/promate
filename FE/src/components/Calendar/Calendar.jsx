import React, { useMemo, useState, useEffect } from 'react';
import './Calendar.css';
import calendarIcon from '../../assets/CalendarIcon.svg';
import plusIcon from '../../assets/icons/plusIcon.svg';
import AddEventModal from '../AddEventModal/AddEventModal';
import apiClient from '../../api/apiClient';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiClient.get('/dashboard/calendar');
        if (response.data.isSuccess) {
          const fetchedEvents = (response.data.data || []).map((item) => {
            const startAt = item.startAt || '';
            const endAt = item.endAt || '';
            const [startYear, startMonth, startDay] = startAt.split('-').map(Number);
            const [endYear, endMonth, endDay] = endAt.split('-').map(Number);
            
            return {
              id: item.scheduleId,
              text: item.title,
              start: new Date(startYear, startMonth - 1, startDay),
              end: new Date(endYear, endMonth - 1, endDay),
              checked: false,
              projectId: item.projectId,
              projectTitle: item.projectTitle,
              content: item.content,
            };
          });
          setEvents(fetchedEvents);
        }
      } catch (error) {
        console.error('캘린더 일정 조회 실패:', error);
      }
    };

    fetchEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddEvent = (newEventData) => {
    const newEvent = {
      id: Date.now(),
      ...newEventData,
      checked: false,
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <section className="calendar-section">
      <div className="calendar-header-row">
        <div className="calendar-header-left">
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

        <div className="calendar-header-right">
          <button className="add-event-btn-header" type="button" onClick={handleOpenModal}>
            <img src={plusIcon} alt="일정 추가 아이콘" />
            <span>일정 추가</span>
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
      </div>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddEvent={handleAddEvent}
      />
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

export default Calendar;