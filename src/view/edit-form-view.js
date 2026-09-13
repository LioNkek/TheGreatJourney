import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES } from '../model/type.js';
import { formatDateForInput } from '../utils/date-utils.js';

function getTypeIcon(type) {
  return `img/icons/${type}.png`;
}

function createTypesHTML(currentType, formId) {
  return TYPES.map((type) => {
    const checked = type === currentType ? 'checked' : '';
    return `
      <div class="event__type-item">
        <input id="event-type-${type}-${formId}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
        <label class="event__type-label event__type-label--${type}" for="event-type-${type}-${formId}">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
      </div>
    `;
  }).join('');
}

function createDestinationsHTML(destinations, currentDestinationName) {
  return destinations.map((dest) => `
    <option value="${dest.name}" ${dest.name === currentDestinationName ? 'selected' : ''}>${dest.name}</option>
  `).join('');
}

function createOffersHTML(offers, selectedOfferIds, formId) {
  if (!offers || offers.length === 0) {
    return '';
  }

  return offers.map((offer) => {
    const checked = selectedOfferIds.includes(offer.id) ? 'checked' : '';
    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}-${formId}" type="checkbox" name="event-offer-${offer.id}" ${checked}>
        <label class="event__offer-label" for="event-offer-${offer.id}-${formId}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
  }).join('');
}

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
  isNew = false,
  formId
}) {
  const typeIcon = point.type || 'flight';
  const typeName = point.type ? point.type.charAt(0).toUpperCase() + point.type.slice(1) : 'Flight';
  const destinationName = destination ? destination.name : '';
  const destinationDescription = destination ? destination.description : '';
  const pictures = destination ? destination.pictures : [];

  const currentTypeOffers = allOffers.filter((offer) =>
    offer.id.startsWith(point.type)
  );

  const typesHTML = createTypesHTML(point.type || 'flight', formId);
  const destinationsHTML = createDestinationsHTML(allDestinations, destinationName);
  const offersHTML = createOffersHTML(currentTypeOffers, offers || [], formId);
  const photosHTML = createPhotosHTML(pictures);

  const dateFrom = point.dateFrom ? formatDateForInput(point.dateFrom) : '';
  const dateTo = point.dateTo ? formatDateForInput(point.dateTo) : '';
  const price = point.basePrice || '';

  return `
    <li class="trip-events__item" data-point-id="${point.id}">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-${formId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${getTypeIcon(typeIcon)}" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-${formId}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typesHTML}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output">
              ${typeName}
            </label>
            <input class="event__input event__input--destination" type="text" name="event-destination" value="${destinationName}" list="destination-list-${formId}" placeholder="Type destination">
            <datalist id="destination-list-${formId}">
              ${destinationsHTML}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden">From</label>
            <input class="event__input event__input--time" data-input="start-time" type="text" name="event-start-time" value="${dateFrom}">
            &mdash;
            <label class="visually-hidden">To</label>
            <input class="event__input event__input--time" data-input="end-time" type="text" name="event-end-time" value="${dateTo}">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" type="text" name="event-price" value="${price}">
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

export default class EditFormView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #allOffers = [];
  #allDestinations = [];
  #formId = null;

  constructor({
    point,
    destination,
    offers,
    allOffers,
    allDestinations,
    isNew = false,
    formId,
    onFormSubmit,
    onRollupClick
  }) {
    super();
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#allOffers = allOffers || [];
    this.#allDestinations = allDestinations || [];
    this.#formId = String(formId).replace(/\./g, '-'); // ✅ Заменяем точки на дефисы

    this._setState({
      point,
      destination,
      offers: offers || [],
      isNew
    });

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate({
      point: this._state.point,
      destination: this._state.destination,
      offers: this._state.offers,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      isNew: this._state.isNew,
      formId: this.#formId
    });
  }

  _restoreHandlers = () => {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#rollupClickHandler);
    }

    const typeInputs = this.element.querySelectorAll('.event__type-input');
    typeInputs.forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });

    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.addEventListener('change', this.#destinationChangeHandler);
    }

    const startTimeInput = this.element.querySelector('[data-input="start-time"]');
    const endTimeInput = this.element.querySelector('[data-input="end-time"]');

    if (startTimeInput) {
      flatpickr(startTimeInput, {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        defaultDate: this._state.point.dateFrom || null,
        onChange: (selectedDates) => {
          this.updateElement({
            point: {
              ...this._state.point,
              dateFrom: selectedDates[0]?.toISOString() || ''
            }
          });
        }
      });
    }

    if (endTimeInput) {
      flatpickr(endTimeInput, {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        defaultDate: this._state.point.dateTo || null,
        onChange: (selectedDates) => {
          this.updateElement({
            point: {
              ...this._state.point,
              dateTo: selectedDates[0]?.toISOString() || ''
            }
          });
        }
      });
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit?.();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick?.();
  };

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;

    this.updateElement({
      point: {
        ...this._state.point,
        type: newType
      },
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const newDestinationName = evt.target.value;
    const newDestination = this.#allDestinations.find(
      (dest) => dest.name === newDestinationName
    );

    if (!newDestination) {
      return;
    }

    this.updateElement({
      destination: newDestination
    });
  };
}
