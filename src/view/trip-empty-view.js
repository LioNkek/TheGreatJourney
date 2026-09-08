import AbstractView from '../framework/view/abstract-view.js';

function createTripEmptyTemplate(filterType) {
  const messages = {
    everything: 'Click New Event to create your first point',
    past: 'There are no past events now',
    present: 'There are no present events now',
    future: 'There are no future events now'
  };

  const message = messages[filterType] || messages.everything;

  return `<p class="trip-events__msg">${message}</p>`;
}

export default class TripEmptyView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createTripEmptyTemplate(this.#filterType);
  }
}
