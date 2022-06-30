import dayjs from 'dayjs';
import { FilterType } from '../utils/enum';
import { getRandomArrayRange } from '../utils/util';

const sortCommented = (a, b) =>  b.comments.length - a.comments.length;
export const sortByDate = (a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date));
export const sortByRating = (a, b) => parseFloat(b.filmInfo.totalRating) - parseFloat(a.filmInfo.totalRating);

export const getTopRated = (films, count = 2) => {
  const hasNoCommentedFilm = films.every((film) => film.filmInfo.totalRating === 0);
  if (hasNoCommentedFilm) {
    return [];
  }
  const filmsToSort = [...films].sort(sortByRating);
  const hasNoUnicValues = filmsToSort.every((film) => film.filmInfo.totalRating === filmsToSort[0].filmInfo.totalRating);
  if (hasNoUnicValues) {
    return getRandomArrayRange(filmsToSort, count);
  }

  return filmsToSort.slice(0, count);
};

export const getMostCommented = (films, count = 2) => {
  const hasNoCommentedFilm = films.every((film) => film.comments.length === 0);
  if (hasNoCommentedFilm) {
    return [];
  }

  const filmsToSort = [...films].sort(sortCommented);
  const hasNoUnicValues = filmsToSort.every((film) => film.comments.length === filmsToSort[0].comments.length);

  if (hasNoUnicValues) {
    return getRandomArrayRange(filmsToSort, count);
  }

  return filmsToSort.slice(0, count);
};

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};
