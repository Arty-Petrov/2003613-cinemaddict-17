import AbstractView from '../framework/view/abstract-view';

const createFilmCommentsTemplate = (filmData) => {
  const {
    comments,
  } = filmData;

  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">${(comments.length === 1) ? 'Comment': 'Comments'} <span class="film-details__comments-count">${comments.length}</span></h3>
      <ul class="film-details__comments-list"></ul>
    </section>`);
};

export default class FilmCommentsView extends AbstractView {
  #filmData = null;

  constructor(filmData) {
    super();
    this.#filmData = filmData;
  }

  get template() {
    return createFilmCommentsTemplate(this.#filmData);
  }

  get commentsListContainer() {
    return this.element.querySelector('.film-details__comments-list');
  }

  setCommentsCount = (count) => {
    const commentsCount = count;
    this.element.querySelector('.film-details__comments-title')
      .innerHTML = `${(commentsCount === 1) ? 'Comment': 'Comments'} <span class="film-details__comments-count">${commentsCount}</span>`;
  };
}
