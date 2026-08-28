import { render } from '../render.js';
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

    // Форма создания
    const addFormComponent = new AddFormView({
      allDestinations: destinations
    });
    render(addFormComponent, this.#tripEventsContainer);

    if (points.length > 0) {
      // Первая точка — в режиме редактирования
      const firstPoint = points[0];
      const destination = this.#model.getDestinationById(firstPoint.destination);
      const firstPointOffers = this.#model.getOffersByIds(firstPoint.offers);

      const editFormComponent = new EditFormView({
        point: firstPoint,
        destination: destination,
        offers: firstPointOffers,
        allOffers: allOffers,
        allDestinations: destinations,
        isNew: false
      });
      render(editFormComponent, this.#tripEventsContainer);

      // Остальные точки — в режиме просмотра
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        const pointDestination = this.#model.getDestinationById(point.destination);
        const currentPointOffers = this.#model.getOffersByIds(point.offers);

        const eventComponent = new EventView({
          point: point,
          destination: pointDestination,
          offers: currentPointOffers
        });
        render(eventComponent, this.#tripEventsContainer);
      }
    }
  }
}
