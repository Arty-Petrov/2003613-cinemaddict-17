import he from 'he';
import { UserAction } from '../utils/enum';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const EMOTION_PATH = './images/emoji/';

const createFilmCommentFormTemplate = (state) => {
  const {
    comment,
    emotion,
    isSaving,
  } = state;

  return (
    `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label ${isSaving ? 'disabled' : ''}">
      ${(emotion) ? (`<src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`) : ''}
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isSaving ? 'disabled' : ''}>${comment ? he.encode(comment): ''}</textarea>
    </label>

    <div class="film-details__emoji-list"${isSaving ? 'disabled' : ''}>
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>`);
};

export default class FilmCommentFormView extends AbstractStatefulView {
  _state = null;
  #emotionSelector = null;
  #commentEmotionLable = null;
  #commentText = null;

  constructor () {
    super();
    this._state = FilmCommentFormView.initState();
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmCommentFormTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  reset = () => {
    this.updateElement(FilmCommentFormView.initState());
  };

  setNewCommentEnter(callback) {
    this._callback.newCommentEnterKeydown = callback;
    document.addEventListener('keydown', this.#newCommentEntertHandler);
  }

  #newCommentEntertHandler = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && (evt.code === 'Enter' || evt.key === 'Enter')){
      const commentData = FilmCommentFormView.convertStateToData(this._state);
      if (commentData.emotion === null || commentData.comment === null) {
        this.shake();
        return;
      }
      evt.preventDefault();
      this._callback.newCommentEnterKeydown(UserAction.ADD_COMMENT, commentData);
    }
  };

  #createNewCommentEmotionLabel = (emotionValue) => {
    const emotionImageSize = 55;
    const emotionLableElement = document.createElement('img');
    emotionLableElement.src = `${EMOTION_PATH}${emotionValue}.png`;
    emotionLableElement.width = emotionImageSize;
    emotionLableElement.height = emotionImageSize;
    emotionLableElement.alt = `emoji-${emotionValue}`;
    return emotionLableElement;
  };

  #emotionSelectorClickHandler = (evt) => {
    if (!evt.target.classList.contains('film-details__emoji-item')){
      return;
    }
    evt.preventDefault();
    const emotionItem = evt.target;
    const emotionValue = evt.target.value;
    this._setState({
      emotion: emotionValue,
    });
    if (this.#commentEmotionLable.firstChild){
      this.#commentEmotionLable.removeChild(this.#commentEmotionLable.firstChild);
      const emotionInputs = this.#emotionSelector.querySelectorAll('input');
      emotionInputs.forEach((el) => {el.removeAttribute('checked');});
    }
    this.#commentEmotionLable.insertAdjacentElement('afterbegin',
      this.#createNewCommentEmotionLabel(emotionValue));
    emotionItem.setAttribute('checked', '');
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    const commentText = evt.target.value;
    this._setState({
      comment: commentText,
    });
  };

  #setInnerHandlers = () => {
    this.#commentEmotionLable = this.element.querySelector('.film-details__add-emoji-label');

    this.#commentText = this.element.querySelector('.film-details__comment-input');
    this.#commentText.addEventListener('input', this.#commentInputHandler);

    this.#emotionSelector = this.element.querySelector('.film-details__emoji-list');
    this.#emotionSelector.addEventListener('click', this.#emotionSelectorClickHandler);
  };

  static initState = () => ({
    isSaving: false,
    comment: null,
    emotion: null,
  });

  static convertStateToData = (state) => {
    const commentData =  {...state};
    delete commentData.isSaving;
    return commentData;
  };
}
