import AbstractView from './abstract-view.js';

const createAddFormTemplate = () => (
  `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-2">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-2" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              <div class="event__type-item">
                <input id="event-type-taxi-2" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-2">Taxi</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-bus-2" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-2">Bus</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-train-2" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-2">Train</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-ship-2" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-2">Ship</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-drive-2" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-2">Drive</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-flight-2" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-2">Flight</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-check-in-2" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-2">Check-in</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-sightseeing-2" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-2">Sightseeing</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-restaurant-2" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-2">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-2">
            Flight
          </label>
          <input class="event__input  event__input--destination" id="event-destination-2" type="text" name="event-destination" value="" list="destination-list-2">
          <datalist id="destination-list-2">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-2">From</label>
          <input class="event__input  event__input--time" id="event-start-time-2" type="text" name="event-start-time" value="">
          &mdash;
          <label class="visually-hidden" for="event-end-time-2">To</label>
          <input class="event__input  event__input--time" id="event-end-time-2" type="text" name="event-end-time" value="">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-2">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-2" type="text" name="event-price" value="">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
    </form>
  </li>`
);

export default class AddFormView extends AbstractView {
  get template() {
    return createAddFormTemplate();
  }
}
