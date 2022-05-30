import { getRandomArrayItem, } from '../utils/util';

const AuthorsList = ['Ilya O\'Reilly', 'Tim Macoveev', 'John Doe',];
const CommentsList = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',

];
const CommentEmotion = ['smile', 'sleeping', 'puke', 'angry'];

export const generateComment = (id) => (
  {
    id: id,
    author: getRandomArrayItem(AuthorsList),
    comment: getRandomArrayItem(CommentsList),
    date: '2019-04-12T16:12:32.554Z',
    emotion: getRandomArrayItem(CommentEmotion),
  }
);
