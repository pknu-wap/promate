import React, { useMemo, useState, useEffect } from 'react';
import './Calendar.css';
import calendarIcon from '../../assets/CalendarIcon.svg';
import plusIcon from '../../assets/icons/plusIcon.svg';
import AddEventModal from '../AddEventModal/AddEventModal';
import EventDetailModal from '../EventDetailModal/EventDetailModal';
import apiClient from '../../api/apiClient';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function Calendar({ showAddButton = true, projectId, projectTitle: fallbackProjectTitle }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setHasError(false);
        let response;
        
        if (projectId) {
          response = await apiClient.get(`/projects/${projectId}/schedules`, {
            params: { year, month: month + 1, _t: new Date().getTime() },
          });
        } else {
          response = await apiClient.get('/dashboard/calendar', {
            params: { _t: new Date().getTime() }
          });
        }

        const responseData = response.data?.data || response.data;
        let eventList = [];
        if (Array.isArray(responseData)) {
          eventList = responseData;
        } else if (responseData && typeof responseData === 'object') {
          const arrays = Object.values(responseData).filter(Array.isArray);
          eventList = arrays.length > 0 ? arrays[0] : [];
        }

        const fetchedEvents = eventList.map((item, index) => {
          const startDateStr = item.startDate || item.startAt || item.start_date || item.date;
          if (!startDateStr) return null;
          const endDateStr = item.endDate || item.endAt || item.end_date || startDateStr;

          const cleanStart = String(startDateStr).split('T')[0].replace(/\./g, '-');
          const cleanEnd = String(endDateStr).split('T')[0].replace(/\./g, '-');

          const [startYear, startMonth, startDay] = cleanStart.split('-').map(Number);
          const [endYear, endMonth, endDay] = cleanEnd.split('-').map(Number);

          if (isNaN(startYear) || isNaN(startMonth) || isNaN(startDay)) return null;
          
          return {
            id: item.scheduleId || item.id || item.taskId || index,
            text: item.title || item.name || item.content || '(제목 없음)',
            start: new Date(startYear, startMonth - 1, startDay),
            end: new Date(endYear, endMonth - 1, endDay),
            checked: false,
            projectId: item.projectId,
            projectTitle: item.projectTitle || fallbackProjectTitle,
            content: item.content,
          };
        }).filter(Boolean);

        setEvents(fetchedEvents);
      } catch (error) {
        console.error('캘린더 일정 조회 실패:', error);
        setHasError(true);
      }
    };

    fetchEvents();
  }, [projectId, year, month]);

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

  const handleAddEvent = async (newEventData) => {
    if (!projectId) return false;

    try {
      const response = await apiClient.post(`/projects/${projectId}/schedules`, newEventData);
      const created = response.data.data;
      
      const startDateStr = created.startDate || created.startAt || newEventData.startDate;
      const endDateStr = created.endDate || created.endAt || newEventData.endDate;

      const cleanStart = startDateStr.split('T')[0].replace(/\./g, '-');
      const cleanEnd = endDateStr.split('T')[0].replace(/\./g, '-');

      const [startYear, startMonth, startDay] = cleanStart.split('-').map(Number);
      const [endYear, endMonth, endDay] = cleanEnd.split('-').map(Number);
      
      const newEvent = {
        id: created.scheduleId,
        text: created.title,
        start: new Date(startYear, startMonth - 1, startDay),
        end: new Date(endYear, endMonth - 1, endDay),
        checked: false,
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      return true;
    } catch (error) {
      console.error('일정 추가 실패:', error);
      alert(error.message || '일정 추가에 실패했습니다.');
      return false;
    }
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
          
          {hasError && (
            <span style={{ color: '#E53E3E', fontSize: '14px', fontWeight: '500', marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
              일정을 불러오는 데 실패했습니다.
            </span>
          )}
        </div>

        {showAddButton && (
          <div className="calendar-header-right">
            <button className="add-event-btn-header" type="button" onClick={handleOpenModal}>
              <img src={plusIcon} alt="일정 추가 아이콘" />
              <span>일정 추가</span>
            </button>
          </div>
        )}
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
                                width: `calc(${eventSpan * 100}% + ${
                                  eventSpan - 1
                                }px)`,
                                cursor: 'pointer',
                              }
                            : { cursor: 'pointer' }
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
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

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
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

      return String(a.id).localeCompare(String(b.id));
    });
}

function isEventSegmentStart(event, year, month, day, index) {
  const currentDate = new Date(year, month, day).getTime();

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

  return Math.min(daysUntilWeekEnd, remainingEventDays);
}

export default Calendar;