import ShowMoreButtonView from '../view/show-more-button-view';
import { render, remove, RenderPosition } from '../framework/render';

export default class ShowMoreButtonPresenter {
  #showMoreButton = null;
  #showMoreButtonContainer = null;

  constructor() {
    this.#showMoreButton = new ShowMoreButtonView();
  }

  init =(container, callback) => {
    this.#showMoreButtonContainer = container;
    this.#showMoreButton.setClickHandler(callback);
    render(this.#showMoreButton, this.#showMoreButtonContainer, RenderPosition.AFTEREND);
  };

  destroy = () => {
    remove(this.#showMoreButton);
  };
}
