import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class FilmsApiService extends ApiService {

  get films() {
    return this._load({url: 'movies'}).then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      'id': film.id,
      'comments': film.comments,
      'film_info': {
        'title': film.filmInfo.title,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating,
        'poster': film.filmInfo.poster,
        'age_rating': film.filmInfo.ageRating,
        'director': film.filmInfo.director,
        'writers': film.filmInfo.writers,
        'actors': film.filmInfo.actors,
        'release': {
          'date': film.filmInfo.release.date,
          'release_country': film.filmInfo.release.releaseCountry
        },
        'runtime': film.filmInfo.runtime,
        'genre': film.filmInfo.genre,
        'description': film.filmInfo.description
      },
      'user_details': {
        'watchlist': !!film.userDetails.watchlist,
        'already_watched': !!film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate,
        'favorite': !!film.userDetails.favorite
      }
    };

    delete adaptedFilm.filmInfo.title;
    delete adaptedFilm.filmInfo.alternativeTitle;
    delete adaptedFilm.filmInfo.totalRating;
    delete adaptedFilm.filmInfo.poster;
    delete adaptedFilm.filmInfo.ageRating;
    delete adaptedFilm.filmInfo.director;
    delete adaptedFilm.filmInfo.writers;
    delete adaptedFilm.filmInfo.actors;
    delete adaptedFilm.filmInfo.release.date;
    delete adaptedFilm.filmInfo.release.releaseCountry;
    delete adaptedFilm.filmInfo.release;
    delete adaptedFilm.filmInfo.runtime;
    delete adaptedFilm.filmInfo.genre;
    delete adaptedFilm.filmInfo.description;
    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails.watchlist;
    delete adaptedFilm.userDetails.alreadyWatched;
    delete adaptedFilm.userDetails.watchingDate;
    delete adaptedFilm.userDetails.favorite;
    delete adaptedFilm.userDetails;

    return adaptedFilm;
  };
}

