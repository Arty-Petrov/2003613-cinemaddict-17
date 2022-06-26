import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

export const cutStringLength = (string, length) => {
  length--;
  return (string.length <= (length)) ? string : `${string.slice(0, length)}…`;
};

export const convertMinutesToHM = (minutes) => {
  const hours = Number(minutes / 60).toFixed(0);
  const hoursString = (hours > 0) ? `${hours}h` : '';
  const minutesString = `${minutes % 60}m`;
  return `${hoursString} ${minutesString}`;
};

export const getHumanTimeFromDate = (isoTime) => {
  dayjs.extend(relativeTimePlugin);
  return dayjs().to(dayjs(isoTime));
};

export const humanizeUTC = (date, format) => dayjs(date).format(format);
