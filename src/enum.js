export const DATA_LENGTH = 30;

export const CommentEmotion = {
  smile: {
    img: 'smile.png',
    alt: 'emoji-smile',
  },
  sleeping: {
    img: 'sleeping.png',
    alt: 'emoji-sleeping',
  },
  puke: {
    img: 'puke.png',
    alt: 'emoji-puke',
  },
  angry: {
    img: 'angry.png',
    alt: 'emoji-angry',
  },
};

export const AuthorizationError = {
  error: '401',
  message: 'Header Authorization is not correct',
};

export const NotFoundError = {
  error: '404',
  message: 'Not found',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const UserRank = [
  {
    rankName: 'Novice',
    watchedMin: 1,
    watchedMax: 10,
  },
  {
    rankName: 'Fan',
    watchedMin: 11,
    watchedMax: 20,
  },
  {
    rankName: 'Movie Buff',
    watchedMin: 21,
    watchedMax: Infinity,
  },
];

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};
