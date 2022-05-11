import AbstractView from '../framework/view/abstract-view';
import { convertMinutesToHM, humanizeUTC } from '../util';

const createFilmDetailsTemplate = (filmDetails) => {
  const {
    comments,
    filmInfo : {
      title,
      alternativeTitle,
      totalRating,
      poster,
      ageRating,
      director,
      writers,
      actors,
      release : {
        date,
        releaseCountry
      },
      runtime,
      genre,
      description
    }
  } = filmDetails;

  const genreString = (genre.length === 1) ? 'Genre' : 'Genres';

  const createGenreList = () => {
    const genresList = [];
    for (const el of genre) {
      genresList.push(`<span class="film-details__genre">${el}</span>`);
    }
    return genresList.join('\n');
  };

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
          
          </div>
          <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRating}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${humanizeUTC(date, 'DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${convertMinutesToHM (runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genreString}</td>
                <td class="film-details__cell">${createGenreList()}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>
          <section class="film-details__controls">
            
            
            
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">${(comments.length === 1) ? 'Comment': 'Comments'} <span class="film-details__comments-count">${comments.length}</span></h3>
            <ul class="film-details__comments-list"></ul>
          </section>
        </div>
      </form>
    </section>`);
};

export default class FilmDetailsView extends AbstractView {
  #markAsWhatchedButton = null;
  #addToWatchListButton = null;
  #showFilmDetailsButton = null;
  #markAsFavoriteButton = null;

  constructor(filmDetails) {
    super();
    this.filmDetails = filmDetails;
  }

  get template() {
    return createFilmDetailsTemplate(this.filmDetails);
  }

  get closeButtonContainer() {
    return this.element.querySelector('.film-details__close');
  }

  get controlsContainer() {
    return this.element.querySelector('.film-details__controls');
  }

  get commentsContainer() {
    return this.element.querySelector('.film-details__comments-list');
  }

  get newCommentContainer() {
    return this.element.querySelector('.film-details__comments-wrap');
  }
}
