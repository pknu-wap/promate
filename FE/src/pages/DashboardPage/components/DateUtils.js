export const getDiffDays = (date) => {
  if (!date) return Infinity;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // 현재 시간 초기화 (00:00:00)

  const targetDate = new Date(date.replace(/\./g, '-'));
  targetDate.setHours(0, 0, 0, 0); // 대상 날짜 시간 초기화 (00:00:00)

  return Math.round((targetDate - today) / (1000 * 60 * 60 * 24));
};