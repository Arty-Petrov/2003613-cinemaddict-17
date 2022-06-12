import Observable from '../framework/observable';
import { generateComment } from '../mock/commets-data';

export default class CommentsModel extends Observable {
  #commentsData = [];
  #filmsData = null;

  constructor (films) {
    super();
    this.#filmsData = films;
  }

  get comments () {
    for (const film of this.#filmsData){
      const commentsIds = film.comments;
      commentsIds.forEach((id) => this.#commentsData.push(generateComment(id)));
    }
    return this.#commentsData;
  }

  addComment = (updateType, update) => {
    this.#commentsData = [
      update,
      ...this.#commentsData,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#commentsData.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#commentsData = [
      ...this.#commentsData.slice(0, index),
      ...this.#commentsData.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
