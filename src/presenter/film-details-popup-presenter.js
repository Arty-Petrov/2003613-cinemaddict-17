import FilmDetailsView from '../view/film-details-view';
import FilmDetailsInnerView from '../view/film-details-inner-view';
import FilmDetailsTopContainerView from '../view/film-details-top-container-view';
import FilmDetailsCloseButtonView from '../view/film-details-close-button';
import FilmDetailsInfoWrapView from '../view/film-details-info-wrap-view';
import FilmDetailsControlsView from '../view/film-details-controls-view';
import FilmDetailsBottomContainerView from '../view/film-details-bottom-container-view';
import FilmDetailsCommentsWrapView from '../view/film-details-comments-wrap-view';
import FilmDetailsCommentsListView from '../view/film-details-comments-list-view';
import FilmDetailsCommentView from '../view/film-details-comment-view';
import FilmDetailsNewCommentView from '../view/film-details-new-comment-view';
import { render, RenderPosition } from '../render.js';


export default class FilmsDetailsPopupPresenter {
  filmDetails = new FilmDetailsView();

  filmDetailsInner = new FilmDetailsInnerView();

  filmDetailsTopContainer = new FilmDetailsTopContainerView();
  filmDetailsCloseButton = new FilmDetailsCloseButtonView();
  filmDetailsInfoWrap = new FilmDetailsInfoWrapView();
  filmDetailsControls = new FilmDetailsControlsView();

  filmDetailsBottomContainer = new FilmDetailsBottomContainerView();
  filmDetailsCommentsWrap = new FilmDetailsCommentsWrapView();
  filmDetailsCommentsList = new FilmDetailsCommentsListView();
  filmDetailsNewComment = new FilmDetailsNewCommentView();


  init = (filmDetailsContainer) => {
    this.filmDetailsContainer = filmDetailsContainer;

    render(this.filmDetails, this.filmDetailsContainer, RenderPosition.AFTEREND);
    render(this.filmDetailsInner, this.filmDetails.getElement());

    render(this.filmDetailsTopContainer, this.filmDetailsInner.getElement());
    render(this.filmDetailsCloseButton, this.filmDetailsTopContainer.getElement());
    render(this.filmDetailsInfoWrap, this.filmDetailsTopContainer.getElement());
    render(this.filmDetailsControls, this.filmDetailsTopContainer.getElement());

    render(this.filmDetailsBottomContainer, this.filmDetailsInner.getElement());
    render(this.filmDetailsCommentsWrap, this.filmDetailsBottomContainer.getElement());
    render(this.filmDetailsCommentsList, this.filmDetailsCommentsWrap.getElement());

    for (let i = 0; i < 5; i++) {
      render(new FilmDetailsCommentView(), this.filmDetailsCommentsList.getElement());
    }

    render(this.filmDetailsNewComment, this.filmDetailsCommentsWrap.getElement());
  };
}
