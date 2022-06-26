import dayjs from 'dayjs';
import { FilterType } from '../utils/enum';

export const getTwoTopRated = (films) => {
  const filmsToSort = [...films];
  const unicValues = filmsToSort.filter((el, index, array) => array.indexOf(el.filmInfo.topRated) !== index);
  const hasUnicValues = filmsToSort.length === unicValues.length;
  if (hasUnicValues.length && hasUnicValues[0].comments.length === 0) {
    return [];
  }
  const sortRated = (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating;
  return filmsToSort.sort(sortRated).slice(0,2);
};

export const getTwoMostCommented = (films) => {
  const filmsToSort = [...films];
  const unicValues = filmsToSort.filter((el, index, array) => array.indexOf(el.comments.length) !== index);
  const hasUnicValues = filmsToSort.length === unicValues.length;
  if (hasUnicValues.length && hasUnicValues[0].comments.length === 0) {
    return [];
  }
  const sortCommented = (a, b) =>  b.comments.length - a.comments.length;
  return filmsToSort.sort(sortCommented).slice(0,2);
};

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};

export const sortByDate = (a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date));
export const sortByRating = (a, b) => parseFloat(b.filmInfo.totalRating) - parseFloat(a.filmInfo.totalRating);
