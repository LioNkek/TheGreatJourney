import AbstractView from './abstract-view.js';

function formatDate(date) {
  const d = new Date(date);
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = String(d.getDate()).padStart(2, '0');
  return `${month} ${day}`;
}

function formatTime(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDuration(dateFrom, dateTo) {
  const diff = new Date(dateTo) - new Date(dateFrom);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}D ${hours % 24}H ${minutes % 60}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes % 60}M`;
  } else {
    return `${minutes}M`;
  }
}

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
    <div class="event">
      <time class="event__date" datetime="${new Date(point.dateFrom).toISOString().split('T')[0]}">${formatDate(point.dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${typeName} ${destination ? destination.name : ''}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${point.dateFrom}">${formatTime(point.dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${point.dateTo}">${formatTime(point.dateTo)}</time>
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
  `;
}

export default class EventView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = [];

  constructor({ point, destination, offers }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers || [];
  }

  get template() {
    return createEventTemplate({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers
    });
  }
}
