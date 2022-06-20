import Observable from '../framework/observable';
import { UpdateType } from '../enum';
export default class FilmsModel extends Observable{
  static #instance = null;
  #filmsApiService = null;
  #films = null;

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch (error) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };

  get films () {
    return this.#films;
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }
    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilms = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        update,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilms);
    } catch(err) {
      throw new Error('Can\'t update task');
    }

    this._notify(updateType, update);
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      id: film['id'],
      comments: film['comments'],
      filmInfo: {
        title: film['film_info']['title'],
        alternativeTitle: film['film_info']['alternative_title'],//?
        totalRating: film['film_info']['total_rating'],
        poster: film['film_info']['poster'],
        ageRating: film['film_info']['age_rating'],
        director: film['film_info']['director'],
        writers: film['film_info']['writers'],
        actors: film['film_info']['actors'],
        release: {
          date: film['film_info']['release']['date'],
          releaseCountry: film['film_info']['release']['release_country']
        },
        runtime: film['film_info']['runtime'],
        genre: film['film_info']['genre'],
        description: film['film_info']['description']
      },
      userDetails: {
        watchlist: film['user_details']['watchlist'],
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date'],
        favorite: film['user_details']['favorite']
      }
    };

    delete adaptedFilm.film_info.title;
    delete adaptedFilm.film_info.alternative_title;
    delete adaptedFilm.film_info.total_rating;
    delete adaptedFilm.film_info.poster;
    delete adaptedFilm.film_info.age_rating;
    delete adaptedFilm.film_info.director;
    delete adaptedFilm.film_info.writers;
    delete adaptedFilm.film_info.actors;
    delete adaptedFilm.film_info.release.date;
    delete adaptedFilm.film_info.release.release_country;
    delete adaptedFilm.film_info.release;
    delete adaptedFilm.film_info.runtime;
    delete adaptedFilm.film_info.genre;
    delete adaptedFilm.film_info.description;
    delete adaptedFilm.film_info;

    delete adaptedFilm.user_details.watchlist;
    delete adaptedFilm.user_details.already_watched;
    delete adaptedFilm.user_details.watching_date;
    delete adaptedFilm.user_details.favorite;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  };
}
