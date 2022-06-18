import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import FilmsModel from '../model/films-model';
import { getRandomArrayItem, getRandomArrayPart, getRandomPositiveInteger, } from '../utils/util';
import { UpdateType } from '../enum';

const Title = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Made for Each Other',
  'The Great Flamarion',
  'A Little Pony Without The Carpet',
];
const TotalRatings = ['8.3', '3.2', '9.0', '2.3', '6.3', '5.8', '8.9'];
const ReleaseYears = ['1929', '1933', '1955', '1964', '1936', '1939', '1945'];
const Durations = ['115', '54', '119', '81', '16', '92', '78'];
const Genres = ['Musical', 'Western', 'Drama', 'Comedy', 'Cartoon', 'Mystery'];
const Posters = [
  'the-dance-of-life.jpg',
  'sagebrush-trail.jpg',
  'the-man-with-the-golden-arm.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'popeye-meets-sinbad.png',
  'made-for-each-other.png',
  'the-great-flamarion.jpg',
];
const Descriptions = [
  'Burlesque comic Ralph \'Skid\' Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…',
  'Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brant\'s narrow escap…',
  'Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…',
  'The Martians Momar (\'Mom Martian\') and Kimar (\'King Martian\') are worried that their children Girmar (\'Girl Martian\') and Bomar (\'Boy Marti…',
  'In this short, Sindbad the Sailor (presumably Bluto playing a \'role\') proclaims himself, in song, to be the greatest sailor, adventurer and…',
  'John Mason (James Stewart) is a young, somewhat timid attorney in New York City. He has been doing his job well, and he has a chance of bei…',
  'The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Grea…',
  'Oscar-winning film, a war drama about two young people, from the creators of timeless classic \'Nu, Pogodi!\' and \'Alice in Wonderland\', with the best fight scenes since Bruce Lee.',
];
const AgeRatings = ['18+', '16+', '6+', '0+'];

export const generateFilm = () => ({
  id: nanoid(10),
  comments:[],
  filmInfo: {
    title: getRandomArrayItem(Title),
    alternativeTitle: '',
    totalRating: getRandomArrayItem(TotalRatings),
    poster: `images/posters/${getRandomArrayItem(Posters)}`,
    ageRating: getRandomArrayItem(AgeRatings),
    director: 'Tom Ford',
    writers: ['Takeshi Kitano'],
    actors: ['Morgan Freeman'],
    release: {
      date: dayjs(getRandomArrayItem(ReleaseYears)).format(
        'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
      ),
      releaseCountry: 'Finland',
    },
    runtime: getRandomArrayItem(Durations),
    genre: getRandomArrayPart(Genres),
    description: getRandomArrayItem(Descriptions),
  },
  userDetails: {
    watchlist: getRandomPositiveInteger(0, 1),
    alreadyWatched: getRandomPositiveInteger(0, 1),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: getRandomPositiveInteger(0, 1),
  },
});

export const putCommentsIdToFilm = (film, commentsSet) => {
  const filmsModel = new FilmsModel();
  const filmToUpdate = film;
  const filmCommentsSet = commentsSet;
  if (filmCommentsSet.constructor.name === 'Array'){
    filmCommentsSet.forEach((comment) => filmToUpdate.comments.push(comment.id));
  } else {
    filmToUpdate.comments.push(filmCommentsSet.id);
  }
  filmsModel.updateFilm(UpdateType.PATCH, filmToUpdate);
};

export const removeCommentIdFromFilm = (film, data) => {
  const filmsModel = new FilmsModel();
  const filmToUpdate = film;
  const commentToRemove = data;
  const commentsData = [...filmToUpdate.comments];
  const indexToRemove = commentsData.indexOf(commentToRemove.id);
  const newCommentsData = [
    ...commentsData.slice(0, indexToRemove),
    ...commentsData.slice(indexToRemove + 1),
  ];
  filmToUpdate.comments = null;
  filmToUpdate.comments = newCommentsData;
  filmsModel.updateFilm(UpdateType.PATCH, filmToUpdate);
};
