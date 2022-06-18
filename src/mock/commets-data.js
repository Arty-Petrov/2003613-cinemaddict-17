import { getRandomArrayItem, } from '../utils/util';
import { nanoid } from 'nanoid';
import { putCommentsIdToFilm } from './film-data';

const AuthorsList = ['Ilya O\'Reilly', 'Tim Macoveev', 'John Doe',];
const CommentsList = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',

];
const CommentEmotion = ['smile', 'sleeping', 'puke', 'angry'];

export const generateComment = (data = null, film = null) => {
  const commentData = data;
  const filmToUpdate = film;
  const newComment = {
    id: nanoid(10),
    author: getRandomArrayItem(AuthorsList),
    comment: (!commentData) ? getRandomArrayItem(CommentsList) : commentData.comment,
    date: (!commentData) ? '2019-04-12T16:12:32.554Z' : new Date,
    emotion: (!commentData) ? getRandomArrayItem(CommentEmotion) : commentData.emotion,
  };
  if (filmToUpdate)  {
    putCommentsIdToFilm(filmToUpdate, newComment);
  }
  return newComment;
};
