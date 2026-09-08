import AbstractView from '../framework/view/abstract-view.js';
import { formatDate, formatTime, formatDuration } from '../utils/date-utils.js';

function createOffersHTML(offers) {
  if (!offers || offers.length === 0) {
    return '';
  }
  return offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('');
}

function createEventTemplate({ point, destination, offers }) {
  const typeName = point.type.charAt(0).toUpperCase() + point.type.slice(1);
  const isFavorite = point.isFavorite ? 'event__favorite-btn--active' : '';
  const offersHTML = createOffersHTML(offers);

  return `
    <li class="trip-events__item" data-point-id="${point.id}">
      <div class="event">
        <time class="event__date">${formatDate(point.dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeName} ${destination ? destination.name : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time">${formatTime(point.dateFrom)}</time>
            &mdash;
            <time class="event__end-time">${formatTime(point.dateTo)}</time>
          </p>
          <p class="event__duration">${formatDuration(point.dateFrom, point.dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersHTML}
        </ul>
        <button class="event__favorite-btn ${isFavorite}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class EventView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = [];
  #handleRollupClick = null;
  #handleFavoriteClick = null;

  constructor({ point, destination, offers, onRollupClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers || [];
    this.#handleRollupClick = onRollupClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler.bind(this));

    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler.bind(this));
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick?.();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick?.();
  };

  get template() {
    return createEventTemplate({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers
    });
  }
}
