import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate({ route, dates, cost }) {
  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #route = '';
  #dates = '';
  #cost = 0;

  constructor({ route, dates, cost }) {
    super();
    this.#route = route;
    this.#dates = dates;
    this.#cost = cost;
  }

  get template() {
    return createTripInfoTemplate({
      route: this.#route,
      dates: this.#dates,
      cost: this.#cost,
    });
  }
}
