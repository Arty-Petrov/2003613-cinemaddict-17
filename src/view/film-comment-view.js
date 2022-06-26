import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getHumanTimeFromDate } from '../utils/util';
import { CommentEmotion, UserAction } from '../utils/enum';

const EMOTION_PATH = './images/emoji/';

const createCommentTemplate = (commentsData) => {
  const {
    author,
    comment,
    date,
    emotion,
    isDeleting,
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
          <span class="film-details__comment-day">${getHumanTimeFromDate(date)}</span>
          <button class="film-details__comment-delete" ${(isDeleting) ? 'disabled': ''}>${(isDeleting) ? 'Deleting': 'Delete'}</button>
        </p>
      </div>
    </li>`
  );
};

export default class FilmCommentView extends AbstractStatefulView {
  #comment = null;
  #deleteCommentButton = null;

  constructor(commentData) {
    super();
    this._state = FilmCommentView.convertCommentToState(commentData);
    this.#setInnerHandlers();
  }

  get template() {
    return createCommentTemplate(this._state);
  }

  static convertCommentToState = (commentData) => ({...commentData,
    isDeleting: false,
  });

  static convertStateToComment = (state) => {
    const commentData = {...state};
    delete commentData.isDeleting;
    return commentData;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;
    this.#deleteCommentButton.addEventListener('click', this.#deleteCommentClickHandler);
  }

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteCommentClick(UserAction.DELETE_COMMENT, FilmCommentView.convertStateToComment(this._state));
  };

  #setInnerHandlers = () => {
    this.#deleteCommentButton = this.element.querySelector('.film-details__comment-delete');
  };
}
