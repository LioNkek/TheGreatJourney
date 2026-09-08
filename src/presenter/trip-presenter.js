import { render, replace } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventView from '../view/event-view.js';
import EditFormView from '../view/edit-form-view.js';
import AddFormView from '../view/add-form-view.js';
import TripEmptyView from '../view/trip-empty-view.js';
import Model from '../model/model.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #filtersContainer = null;
  #sortContainer = null;
  #model = null;
  #pointComponents = new Map();
  #currentFilter = 'everything';

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

  #getFilters() {
    const points = this.#model.points;
    const now = new Date();

    const filterTypes = [
      { type: 'everything', name: 'Everything' },
      { type: 'future', name: 'Future' },
      { type: 'present', name: 'Present' },
      { type: 'past', name: 'Past' }
    ];

    const futurePoints = points.filter((point) => new Date(point.dateFrom) > now);
    const presentPoints = points.filter((point) => {
      const from = new Date(point.dateFrom);
      const to = new Date(point.dateTo);
      return from <= now && to >= now;
    });
    const pastPoints = points.filter((point) => new Date(point.dateTo) < now);

    const counts = {
      future: futurePoints.length,
      present: presentPoints.length,
      past: pastPoints.length
    };

    return filterTypes.map((filter) => ({
      type: filter.type,
      name: filter.name,
      checked: filter.type === this.#currentFilter,
      disabled: points.length === 0 ? filter.type !== 'everything' : counts[filter.type] === 0
    }));
  }

  #renderFilters() {
    const filters = this.#getFilters();
    const filtersComponent = new FiltersView({ filters });
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

    // Если точек нет — показываем заглушку
    if (points.length === 0) {
      this.#renderEmpty('everything');
      return;
    }

    // Форма создания
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

  #renderEmpty(filterType) {
    const emptyComponent = new TripEmptyView({ filterType });
    render(emptyComponent, this.#tripEventsContainer);
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
