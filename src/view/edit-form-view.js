import AbstractView from './abstract-view.js';
import { TYPES } from '../model/type.js';

// Вспомогательная функция для иконки
function getTypeIcon(type) {
  return `img/icons/${type}.png`;
}

// Генерация HTML для типов
function createTypesHTML(currentType) {
  return TYPES.map((type) => {
    const checked = type === currentType ? 'checked' : '';
    return `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
        <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
      </div>
    `;
  }).join('');
}

// Генерация HTML для пунктов назначения
function createDestinationsHTML(destinations, currentDestinationId) {
  return destinations.map((dest) => `
    <option value="${dest.id}" ${dest.id === currentDestinationId ? 'selected' : ''}>${dest.name}</option>
  `).join('');
}

// Генерация HTML для опций
function createOffersHTML(offers, selectedOfferIds) {
  if (!offers || offers.length === 0) {
    return '';
  }

  return offers.map((offer) => {
    const checked = selectedOfferIds.includes(offer.id) ? 'checked' : '';
    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${checked}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
  }).join('');
}

// Генерация HTML для фотографий
function createPhotosHTML(pictures) {
  if (!pictures || pictures.length === 0) {
    return '';
  }

  return pictures.map((pic) => `
    <img class="event__photo" src="${pic.src}" alt="${pic.description || 'Event photo'}">
  `).join('');
}

function createEditFormTemplate({
  point,
  destination,
  offers,
  allOffers,
  allDestinations,
  isNew = false
}) {
  const typeIcon = point.type || 'flight';
  const typeName = point.type ? point.type.charAt(0).toUpperCase() + point.type.slice(1) : 'Flight';
  const destinationName = destination ? destination.name : '';
  const destinationDescription = destination ? destination.description : '';
  const pictures = destination ? destination.pictures : [];

  const typesHTML = createTypesHTML(point.type || 'flight');
  const destinationsHTML = createDestinationsHTML(allDestinations, destination ? destination.id : '');
  const offersHTML = createOffersHTML(allOffers, offers || []);
  const photosHTML = createPhotosHTML(pictures);

  const dateFrom = point.dateFrom ? point.dateFrom.split('T').join(' ').slice(0, 16) : '';
  const dateTo = point.dateTo ? point.dateTo.split('T').join(' ').slice(0, 16) : '';
  const price = point.basePrice || '';

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${getTypeIcon(typeIcon)}" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typesHTML}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">
              ${typeName}
            </label>
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsHTML}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isNew ? 'Cancel' : 'Delete'}</button>
          ${isNew ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}
        </header>

        <section class="event__details">
          ${offersHTML ? `
            <section class="event__section event__section--offers">
              <h3 class="event__section-title event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${offersHTML}
              </div>
            </section>
          ` : ''}

          ${destinationDescription || photosHTML ? `
            <section class="event__section event__section--destination">
              <h3 class="event__section-title event__section-title--destination">Destination</h3>
              ${destinationDescription ? `<p class="event__destination-description">${destinationDescription}</p>` : ''}
              ${photosHTML ? `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${photosHTML}
                  </div>
                </div>
              ` : ''}
            </section>
          ` : ''}
        </section>
      </form>
    </li>
  `;
}

export default class EditFormView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = [];
  #allOffers = [];
  #allDestinations = [];
  #isNew = false;

  constructor({ point, destination, offers, allOffers, allDestinations, isNew = false }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers || [];
    this.#allOffers = allOffers || [];
    this.#allDestinations = allDestinations || [];
    this.#isNew = isNew;
  }

  get template() {
    return createEditFormTemplate({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      isNew: this.#isNew
    });
  }
}
