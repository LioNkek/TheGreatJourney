import { render, replace } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventView from '../view/event-view.js';
import EditFormView from '../view/edit-form-view.js';
import AddFormView from '../view/add-form-view.js';
import Model from '../model/model.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #filtersContainer = null;
  #sortContainer = null;
  #model = null;
  #pointComponents = new Map();

  constructor({ tripEventsContainer, filtersContainer, sortContainer }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#filtersContainer = filtersContainer;
    this.#sortContainer = sortContainer;
    this.#model = new Model();
  }

  init() {
    this.#renderFilters();
    this.#renderSort();
    this.#renderTripEvents();

    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #renderFilters() {
    const filtersComponent = new FiltersView();
    render(filtersComponent, this.#filtersContainer);
  }

  #renderSort() {
    const sortComponent = new SortView();
    render(sortComponent, this.#sortContainer);
  }

  #renderTripEvents() {
    const points = this.#model.points;
    const destinations = this.#model.destinations;
    const allOffers = this.#model.offers;

    const addFormComponent = new AddFormView({
      allDestinations: destinations
    });
    render(addFormComponent, this.#tripEventsContainer);

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      this.#renderPoint(point, destinations, allOffers);
    }
  }

  #renderPoint(point, destinations, allOffers) {
    const pointDestination = this.#model.getDestinationById(point.destination);
    const pointOffers = this.#model.getOffersByIds(point.offers);

    const eventComponent = new EventView({
      point: point,
      destination: pointDestination,
      offers: pointOffers,
      onRollupClick: () => {
        this.#replacePointToEdit(point, destinations, allOffers);
      }
    });

    this.#pointComponents.set(point.id, {
      eventComponent,
      editComponent: null
    });

    render(eventComponent, this.#tripEventsContainer);
  }

  #replacePointToEdit(point, destinations, allOffers) {
    const components = this.#pointComponents.get(point.id);

    if (components && components.editComponent) {
      this.#replaceEditToPoint(point);
      return;
    }

    this.#closeAllEdits();

    const pointDestination = this.#model.getDestinationById(point.destination);
    const pointOffers = this.#model.getOffersByIds(point.offers);

    const oldEventComponent = components.eventComponent;

    const editComponent = new EditFormView({
      point: point,
      destination: pointDestination,
      offers: pointOffers,
      allOffers: allOffers,
      allDestinations: destinations,
      isNew: false,
      onFormSubmit: () => {
        this.#replaceEditToPoint(point);
      },
      onRollupClick: () => {
        this.#replaceEditToPoint(point);
      }
    });

    replace(editComponent, oldEventComponent);
    components.editComponent = editComponent;
  }

  #replaceEditToPoint(point) {
    const components = this.#pointComponents.get(point.id);
    if (!components || !components.editComponent) {
      return;
    }

    const oldEditComponent = components.editComponent;
    const eventComponent = components.eventComponent;

    replace(eventComponent, oldEditComponent);
    components.editComponent = null;
  }

  #closeAllEdits() {
    for (const [pointId, components] of this.#pointComponents) {
      if (components.editComponent) {
        this.#replaceEditToPoint({ id: pointId });
      }
    }
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#closeAllEdits();
    }
  };
}
