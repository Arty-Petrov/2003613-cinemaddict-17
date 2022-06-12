import AbstractView from '../framework/view/abstract-view';

const ITEM_ACTIVE_CLASS = 'main-navigation__item--active';

const createFilterItemTemplate = (filter, filterType) => {
  const {type, name, count} = filter;
  const activeClass = (type === filterType) ? ` ${ITEM_ACTIVE_CLASS}` : '';
  const countElement = (type !== 'all') ? `<span class="main-navigation__item-count">${count}</span>`: '';

  return (
    `<a href="#${type}" class="main-navigation__item${activeClass}" data-filter-type="${type}">${name} ${countElement}</a>`
  );
};

const createMainNavigationTemplate = (filters, filterType) => {
  const filterItems = filters;
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, filterType))
    .join('');

  return `<nav class="main-navigation">
  ${filterItemsTemplate}
  </nav>`;
};
export default class MainNavigationView extends AbstractView {
  #filters = null;
  #filterType = null;

  constructor(filters, filterType) {
    super();
    this.#filters = filters;
    this.#filterType = filterType;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters, this.#filterType);
  }

  setNavigationTypeChangeHandler(callback) {
    this._callback.navigationTypeChange = callback;
    this.element.addEventListener('click', this.#navigationTypeChangeHandler);
  }

  #navigationTypeChangeHandler = (evt) => {
    const isLinkItem = evt.target.classList.contains('main-navigation__item');
    const isSpanItem = evt.target.classList.contains('main-navigation__item-count');
    if (!(!isLinkItem || !isSpanItem)){
      return;
    }

    evt.preventDefault();
    const evtFilterType = (isSpanItem) ? evt.target.closest('a').dataset.filterType : evt.target.dataset.filterType;
    this.element.querySelector(`.${ITEM_ACTIVE_CLASS}`).classList.remove(ITEM_ACTIVE_CLASS);
    this.element.querySelector(`[data-filter-type="${evtFilterType}"]`).classList.add(ITEM_ACTIVE_CLASS);

    this._callback.navigationTypeChange(evtFilterType);
  };
}
