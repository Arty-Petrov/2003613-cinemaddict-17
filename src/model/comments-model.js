import { DATA_LENGTH } from '../enum';
import { generateComment } from '../mock/commets-data';


export default class CommentsModel {
  #comments = Array.from({length: DATA_LENGTH}, (v, k) => generateComment(k));
  get comments () {return this.#comments;}
}
