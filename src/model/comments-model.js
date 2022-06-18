/* eslint-disable indent */
import Observable from '../framework/observable';
import { generateComment } from '../mock/commets-data';
import { putCommentsIdToFilm } from '../mock/film-data';
import { getRandomPositiveInteger } from '../utils/util';
import { removeCommentIdFromFilm } from '../mock/film-data';
export default class CommentsModel extends Observable {
  static #instance = null;
  #commentsData = [];
  #filmsData = null;

  constructor (films) {
    const filmsData = films;
    if (!CommentsModel.#instance) {
      super();
      this.#filmsData = filmsData;

      for (const film of this.#filmsData) {
        const filmCommentsSet = Array.from({length: getRandomPositiveInteger(1,5)}, () => generateComment());
        this.#commentsData.push(...filmCommentsSet);
        putCommentsIdToFilm(film, filmCommentsSet);
      }
      CommentsModel.#instance = this;
      return;
    }
    return CommentsModel.#instance;
  }

  get comments () {
    return this.#commentsData;
  }

  addComment = (updateType, film, update) => {
    const newComment = generateComment(update, film);
    this.#commentsData = [
      newComment,
      ...this.#commentsData,
    ];

    this._notify(updateType, newComment);
  };

  deleteComment = (updateType, film, update) => {
    const updateId = update.id;
    const index = this.#commentsData.findIndex((comment) => comment.id === update.id);
    removeCommentIdFromFilm(film, update);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#commentsData = [
      ...this.#commentsData.slice(0, index),
      ...this.#commentsData.slice(index + 1),
    ];

    this._notify(updateType, updateId);
  };
}
