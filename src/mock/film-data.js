import dayjs from 'dayjs';
import { getRandomArrayItem, getRandomArrayPart } from '../util';

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
const Durations = ['1h 55m', '54m', '1h 59m', '1h 21m', '16m', '1h 32m', '1h 18m'];
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
  'Oscar-winning film, a war drama about two young people, from the creators of timeless classic \'Nu, Pogodi!\' and \'Alice in Wonderland\', with the best fight scenes since Bruce Lee.'
];
const AgeRatings = ['18+', '16+', '6+', '0+'];

export const generateFilm = (filmId) => (
  {
    id: filmId,
    comments: [
      '$Comment.id$', '$Comment.id$'
    ],
    filmInfo: {
      title: getRandomArrayItem(Title),
      alternativeTitle: '',
      totalRating: getRandomArrayItem(TotalRatings),
      poster: `images/posters/${getRandomArrayItem(Posters)}`,
      ageRating: getRandomArrayItem(AgeRatings),
      director: 'Tom Ford',
      writers: [
        'Takeshi Kitano'
      ],
      actors: [
        'Morgan Freeman'
      ],
      release: {
        date:  dayjs(getRandomArrayItem(ReleaseYears)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        releaseCountry: 'Finland'
      },
      runtime: getRandomArrayItem(Durations),
      genre: getRandomArrayPart(Genres),
      description: getRandomArrayItem(Descriptions)
    },
    userDetails: {
      watchlist: false,
      alreadyWatched: true,
      watchingDate: '2019-04-12T16:12:32.554Z',
      favorite: false,
    },
  }
);
