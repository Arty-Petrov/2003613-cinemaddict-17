import he from 'he';
import AbstractView from '../framework/view/abstract-view';
import { humanizeUTC } from '../utils/util';
import { CommentEmotion, UserAction, UpdateType } from '../enum';

const EMOTION_PATH = './images/emoji/';

const createCommentTemplate = (commentsData) => {
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
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeUTC(date, 'YYYY/MM/D HH:MM')}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class FilmCommentView extends AbstractView {
  #commentData = null;
  #deleteCommentButton = null;

  constructor(commentData) {
    super();
    this.#commentData = commentData;
    this.#deleteCommentButton = this.element.querySelector('.film-details__comment-delete');
  }

  get template() {
    return createCommentTemplate(this.#commentData);
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;
    this.#deleteCommentButton.addEventListener('click', this.#deleteCommentClickHandler);
  }

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteCommentClick(UserAction.DELETE_COMMENT, UpdateType.PATCH, this.#commentData);
    this.element.scrollIntoView(top);
  };
}