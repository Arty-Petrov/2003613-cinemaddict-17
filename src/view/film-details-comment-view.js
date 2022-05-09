import { createElement } from '../render.js';
import { humanizeUTC } from '../util.js';
import { CommentEmotion } from '../enum';

const EMOTION_PATH = './images/emoji/';

const createFilmDetailsCommentTemplate = (commentsData) => {
  const {
    author,
    comment,
    date,
    emotion,
  } = commentsData;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${EMOTION_PATH}${CommentEmotion[emotion].img}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeUTC(date, 'YYYY/MM/D HH:MM')}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class FilmDetailsCommentView {
  #element = null;
  #commentData = null;

  constructor(commentData) {
    this.#commentData = commentData;
  }

  get template() {
    return createFilmDetailsCommentTemplate(this.#commentData);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
