import AbstractView from '../framework/view/abstract-view';

const createFilmsTemplate = () => (
  `<section class="films">
    <section class="films-list">
     <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`);

export default class FilmsListView extends AbstractView {
  get template() {
    return createFilmsTemplate();
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }
}
