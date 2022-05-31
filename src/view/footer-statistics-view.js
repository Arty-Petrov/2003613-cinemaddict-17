import AbstractView from '../framework/view/abstract-view';

const createFooterStatisticsTemplate = (filmsCount) => `<p>${filmsCount} ${(filmsCount===1) ? 'movie' : 'movies'} inside</p>`;

export default class FooterStatisticsView extends AbstractView {
  #filmsCount = null;

  constructor (filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#filmsCount);
  }
}
