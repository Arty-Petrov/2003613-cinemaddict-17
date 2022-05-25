import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../enum';

const createMainSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class MainSortView extends AbstractView {

  get template() {
    return createMainSortTemplate();
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (!evt.target.classList.contains('sort__button')){
      return;
    }

    evt.preventDefault();
    const evtSortType = evt.target.dataset.sortType;
    this._callback.sortTypeChange(evtSortType);
    this.element.querySelector('.sort__button--active').classList.remove('sort__button--active');
    this.element.querySelector(`[data-sort-type="${evtSortType}"]`).classList.add('sort__button--active');
  };
}
