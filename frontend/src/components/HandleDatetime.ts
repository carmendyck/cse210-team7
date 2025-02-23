export const getTomorrowBeforeMidnight = (): Date => {
  const dueDateTime = new Date();
  dueDateTime.setDate(dueDateTime.getDate() + 1);
  dueDateTime.setHours(23, 59, 59, 999);
  return dueDateTime;
};

export const formatLocalDateForIonDatetime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};