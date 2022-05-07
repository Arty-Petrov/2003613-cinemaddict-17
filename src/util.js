export const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

export const getRandomPositiveFloat = (a, b, digits = 1) => {
  const lower = Math.min(Math.abs(a), Math.abs(b));
  const upper = Math.max(Math.abs(a), Math.abs(b));
  const result = Math.random() * (upper - lower) + lower;
  return +result.toFixed(digits);
};

export const getRandomArrayItem = (array) => array[getRandomPositiveInteger(0, array.length - 1)];

export const getRandomArrayPart = (array) => {
  const max = getRandomPositiveInteger(0, array.length - 1);
  const min = getRandomPositiveInteger(0, max);
  return array.slice(min, max + 1);
};

export const getRandomArrayRange = (array, rangeSize) => {
  const arrayItemsCount = array.length;
  const rangeItemsCount = (rangeSize < arrayItemsCount) ? rangeSize : arrayItemsCount;
  const rangeStartIndex = getRandomPositiveInteger(0, arrayItemsCount);
  let resultArray = [];
  if ((rangeStartIndex + rangeItemsCount) > arrayItemsCount) {
    resultArray = resultArray.concat(array.slice(rangeStartIndex));
    resultArray = resultArray.concat(array.slice(0, rangeStartIndex + rangeItemsCount - arrayItemsCount));
    return resultArray;
  }
  const rangeEndIndex = rangeStartIndex + rangeItemsCount;
  resultArray = resultArray.concat(array.slice(rangeStartIndex, rangeEndIndex));
  return resultArray;
};

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
