import { useMemo, useState } from 'react';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

function toDateValue(date) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function getDateFromValue(value) {
  return value ? new Date(`${value}T00:00:00`) : new Date();
}

function formatDateLabel(value) {
  if (!value) {
    return '날짜 선택';
  }

  const [year, month, day] = value.split('-');
  const date = getDateFromValue(value);
  const weekday = weekdays[date.getDay()];

  return `${year} - ${month} - ${day}\n(${weekday})`;
}

function formatPickerHeader(value) {
  const date = getDateFromValue(value);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: weekdays[date.getDay()],
  };
}

function ProjectPeriodField({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  const [pickerTarget, setPickerTarget] = useState(null);
  const [draftDate, setDraftDate] = useState('');
  const [visibleMonth, setVisibleMonth] = useState(() => getDateFromValue(startDate));

  const selectedValue = pickerTarget === 'start' ? startDate : endDate;
  const pickerHeader = formatPickerHeader(draftDate || selectedValue);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let index = 0; index < firstDay.getDay(); index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [visibleMonth]);

  const openPicker = (target) => {
    const value = target === 'start' ? startDate : endDate;
    const nextDate = getDateFromValue(value);

    setPickerTarget(target);
    setDraftDate(value);
    setVisibleMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
  };

  const closePicker = () => {
    setPickerTarget(null);
    setDraftDate('');
  };

  const moveMonth = (amount) => {
    setVisibleMonth((currentMonth) => (
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + amount, 1)
    ));
  };

  const selectDay = (date) => {
    setDraftDate(toDateValue(date));
  };

  const clearDate = () => {
    if (pickerTarget === 'start') {
      onStartDateChange('');
    } else {
      onEndDateChange('');
    }

    closePicker();
  };

  const applyDate = () => {
    if (pickerTarget === 'start') {
      onStartDateChange(draftDate);
    } else {
      onEndDateChange(draftDate);
    }

    closePicker();
  };

  return (
    <div className="form-field project-period-field">
      <span className="teammaking-form-label">프로젝트 기간</span>

      <div className="project-period-row">
        <button
          type="button"
          className="period-date-picker"
          onClick={() => openPicker('start')}
          aria-label="프로젝트 시작일 선택"
        >
          <span className="period-date-display">{formatDateLabel(startDate)}</span>
        </button>

        <span className="period-separator" aria-hidden="true">
          ~
        </span>

        <button
          type="button"
          className="period-date-picker"
          onClick={() => openPicker('end')}
          aria-label="프로젝트 종료일 선택"
        >
          <span className="period-date-display">{formatDateLabel(endDate)}</span>
        </button>
      </div>

      {pickerTarget && (
        <div className="date-picker-backdrop" role="presentation" onMouseDown={closePicker}>
          <div
            className="date-picker-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="프로젝트 날짜 선택"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="date-picker-hero">
              <span>{pickerHeader.year}년</span>
              <strong>
                {pickerHeader.month}월 {pickerHeader.day}일 ({pickerHeader.weekday})
              </strong>
            </div>

            <div className="date-picker-calendar">
              <div className="date-picker-monthbar">
                <button type="button" onClick={() => moveMonth(-1)} aria-label="이전 달">
                  ‹
                </button>
                <strong>
                  {visibleMonth.getFullYear()}년 {visibleMonth.getMonth() + 1}월
                </strong>
                <button type="button" onClick={() => moveMonth(1)} aria-label="다음 달">
                  ›
                </button>
              </div>

              <div className="date-picker-weekdays" aria-hidden="true">
                {weekdays.map((weekday) => (
                  <span key={weekday}>{weekday}</span>
                ))}
              </div>

              <div className="date-picker-days">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <span key={`empty-${index}`} />;
                  }

                  const value = toDateValue(date);
                  const isSelected = value === draftDate;

                  return (
                    <button
                      key={value}
                      type="button"
                      className={isSelected ? 'date-picker-day date-picker-day--selected' : 'date-picker-day'}
                      onClick={() => selectDay(date)}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="date-picker-actions">
                <button type="button" onClick={clearDate}>
                  삭제
                </button>
                <button type="button" onClick={closePicker}>
                  취소
                </button>
                <button type="button" onClick={applyDate}>
                  설정
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPeriodField;
