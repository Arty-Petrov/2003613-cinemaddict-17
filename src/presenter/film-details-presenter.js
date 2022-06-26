import FilmDetailsView from '../view/film-details-view';
import FilmDetailsControlsView from '../view/film-details-controls-view';
import { render, replace, remove } from '../framework/render';
import { UpdateType, UserAction } from '../utils/enum';
export default class FilmDetailsPresenter {
  static #instance = null;
  #filmData = null;

  #detailsSectionContainer = null;
  #details = null;
  #existDetails = null;
  #controls = null;
  #existControls = null;

  #handleDetailsActions = null;

  constructor(container, callback) {
    this.#detailsSectionContainer = container;
    this.#handleDetailsActions = callback;
  }

  init = (filmData) => {
    this.#filmData = filmData;
    this.#renderDetails();
    this.#renderControls();
  };

  destroy = () => {
    remove(this.#details);
    remove(this.#controls);
    FilmDetailsPresenter.#instance = null;
  };

  setSaving = (userDetailsType) => {
    this.#controls.updateElement({
      isDisabled: userDetailsType,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#controls.updateElement(this.#filmData);
    };

    this.#controls.shake(resetFormState);
  };

  #renderDetails = () => {
    this.#existDetails = this.#details;
    this.#details = new FilmDetailsView(this.#filmData);

    if (!this.#existDetails) {
      render(this.#details, this.#detailsSectionContainer);
      this.#existDetails = this.#details;
      return;
    }
    replace(this.#details, this.#existDetails);
    remove(this.#existDetails);
  };

  #renderControls = () => {
    this.#existControls = this.#controls;
    this.#controls = new FilmDetailsControlsView(this.#filmData);
    this.#controls.setUserDetailsControlsHandler(this.#handleViewActions);

    if (!this.#existControls) {
      render(this.#controls, this.#detailsSectionContainer);
      this.#existControls = this.#controls;
      return;
    }
    replace(this.#controls, this.#existControls);
    remove(this.#existControls);
  };

  #handleViewActions = (updateData, userDetailsType) => {
    this.#handleDetailsActions(UserAction.UPDATE_DETAILS, UpdateType.MINOR, updateData, userDetailsType);
  };
}
