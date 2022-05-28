import { generateComment } from '../mock/commets-data';

export default class CommentsModel {
  static #instance = null;
  #comments = [];
  #filmsData = null;

  constructor(films) {
    this.#filmsData = films;
    this.#getComments(this.#filmsData);
    return CommentsModel.#instance;
  }

  #getComments = (films) => {
    for (const film of films){
      const commentsIds = film.comments;
      commentsIds.forEach((id) => this.#comments.push(generateComment(id)));
    }
  };

  get comments () {
    return this.#comments;
  }
}
