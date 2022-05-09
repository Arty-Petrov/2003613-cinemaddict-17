import { generateComment } from '../mock/commets-data';

export default class CommentsModel {
  #comments = Array.from({length: 30}, (v, k) => generateComment(k));
  get comments () {return this.#comments;}
}
