import { render, replace } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class PointPresenter {
  #point = null;
  #pointComponent = null;
  #editComponent = null;
  #destinations = [];
  #allOffers = [];
  #container = null;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor({ point, destinations, allOffers, onDataChange, onModeChange }) {
    this.#point = point;
    this.#destinations = destinations;
    this.#allOffers = allOffers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(container) {
    this.#container = container;
    this.#renderPoint();
  }

  #createEventComponent() {
    const currentDestination = this.#destinations.find(
      (dest) => dest.id === this.#point.destination
    );
    const currentPointOffers = this.#allOffers.filter((offer) =>
      this.#point.offers.includes(offer.id)
    );

    return new EventView({
      point: this.#point,
      destination: currentDestination,
      offers: currentPointOffers,
      onRollupClick: () => {
        this.#replacePointToEdit();
      },
      onFavoriteClick: () => {
        this.#handleFavoriteClick();
      }
    });
  }

  #createEditComponent() {
    const currentDestination = this.#destinations.find(
      (dest) => dest.id === this.#point.destination
    );
    const currentPointOffers = this.#allOffers.filter((offer) =>
      this.#point.offers.includes(offer.id)
    );

    return new EditFormView({
      point: this.#point,
      destination: currentDestination,
      offers: currentPointOffers,
      allOffers: this.#allOffers,
      allDestinations: this.#destinations,
      isNew: false,
      onFormSubmit: () => {
        this.#replaceEditToPoint();
      },
      onRollupClick: () => {
        this.#replaceEditToPoint();
      }
    });
  }

  #renderPoint() {
    const eventComponent = this.#createEventComponent();
    this.#pointComponent = eventComponent;
    render(eventComponent, this.#container);
  }

  #replacePointToEdit() {
    this.#handleModeChange?.();

    const editComponent = this.#createEditComponent();
    this.#editComponent = editComponent;
    replace(editComponent, this.#pointComponent);
  }

  #replaceEditToPoint() {
    if (!this.#editComponent) {
      return;
    }

    replace(this.#pointComponent, this.#editComponent);
    this.#editComponent = null;
  }

  #handleFavoriteClick() {
    const updatedPoint = {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    };
    this.#handleDataChange(updatedPoint);
  }

  resetView() {
    if (this.#editComponent) {
      this.#replaceEditToPoint();
    }
  }

  updatePoint(updatedPoint) {
    this.#point = updatedPoint;

    if (this.#editComponent) {
      const newEditComponent = this.#createEditComponent();
      replace(newEditComponent, this.#editComponent);
      this.#editComponent = newEditComponent;
      return;
    }

    const newPointComponent = this.#createEventComponent();
    replace(newPointComponent, this.#pointComponent);
    this.#pointComponent = newPointComponent;
  }

  destroy() {
    if (this.#pointComponent) {
      this.#pointComponent.removeElement();
      this.#pointComponent = null;
    }
    if (this.#editComponent) {
      this.#editComponent.removeElement();
      this.#editComponent = null;
    }
  }
}
