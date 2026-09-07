import AbstractView from '../framework/view/abstract-view.js';
import { TYPES } from '../model/type.js';

function getTypeIcon(type) {
  return `img/icons/${type}.png`;
}

function createTypesHTML(currentType) {
  return TYPES.map((type) => {
    const checked = type === currentType ? 'checked' : '';
    return `
      <div class="event__type-item">
        <input id="event-type-${type}-2" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
        <label class="event__type-label event__type-label--${type}" for="event-type-${type}-2">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
      </div>
    `;
  }).join('');
}

function createDestinationsHTML(destinations) {
  return destinations.map((dest) => `
    <option value="${dest.name}">${dest.name}</option>
  `).join('');
}

function createAddFormTemplate({ allDestinations }) {
  const typesHTML = createTypesHTML('flight');
  const destinationsHTML = createDestinationsHTML(allDestinations);

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-2">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${getTypeIcon('flight')}" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-2" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typesHTML}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-2">
              Flight
            </label>
            <input class="event__input event__input--destination" id="event-destination-2" type="text" name="event-destination" value="" list="destination-list-2" placeholder="Type destination">
            <datalist id="destination-list-2">
              ${destinationsHTML}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-2">From</label>
            <input class="event__input event__input--time" id="event-start-time-2" type="text" name="event-start-time" value="">
            &mdash;
            <label class="visually-hidden" for="event-end-time-2">To</label>
            <input class="event__input event__input--time" id="event-end-time-2" type="text" name="event-end-time" value="">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-2">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price-2" type="text" name="event-price" value="0">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
      </form>
    </li>
  `;
}

export default class AddFormView extends AbstractView {
  #allDestinations = [];

  constructor({ allDestinations }) {
    super();
    this.#allDestinations = allDestinations || [];
  }

  get template() {
    return createAddFormTemplate({
      allDestinations: this.#allDestinations
    });
  }
}
