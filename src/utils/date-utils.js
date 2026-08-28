import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

// Подключаем плагин для работы с длительностью
dayjs.extend(duration);

// Формат для отображения даты в карточке: "18/09/26"
export function formatDate(date) {
  return dayjs(date).format('DD/MM/YY');
}

// Формат для времени: "18:00"
export function formatTime(date) {
  return dayjs(date).format('HH:mm');
}

// Формат для поля ввода: "18/09/26 18:00"
export function formatDateForInput(date) {
  if (!date) {
    return '';
  }
  return dayjs(date).format('DD/MM/YY HH:mm');
}

// Форматирование длительности: "1D 02H 30M"
export function formatDuration(dateFrom, dateTo) {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const diffDuration = dayjs.duration(diff);

  const days = Math.floor(diffDuration.asDays());
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();

  if (days > 0) {
    return `${days}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else {
    return `${minutes}M`;
  }
}

// Проверка, что дата валидная
export function isValidDate(date) {
  return dayjs(date).isValid();
}
