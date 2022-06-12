
import dayjs from 'dayjs';
import { FilterType } from '../enum';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};

export const sortByDate = (a, b) => dayjs(a.filmInfo.release.date).isBefore(dayjs(b.filmInfo.release.date));

export const sortByRating = (a, b) => parseFloat(b.filmInfo.totalRating) - parseFloat(a.filmInfo.totalRating);
