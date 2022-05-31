import { generateComment } from '../mock/commets-data';

export default class CommentsModel {
  #comments = [];
  #filmsData = null;

  constructor(films) {
    this.#filmsData = films;
  }

  get comments () {
    for (const film of this.#filmsData){
      const commentsIds = film.comments;
      commentsIds.forEach((id) => this.#comments.push(generateComment(id)));
    }
    return this.#comments;
  }
}
