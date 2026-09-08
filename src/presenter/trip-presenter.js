import { render } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import AddFormView from '../view/add-form-view.js';
import TripEmptyView from '../view/trip-empty-view.js';
import PointPresenter from './point-presenter.js';
import Model from '../model/model.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #filtersContainer = null;
  #sortContainer = null;
  #model = null;
  #currentFilter = 'everything';
  #currentSort = 'day';
  #pointPresenters = new Map();

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
    const sortComponent = new SortView({
      currentSort: this.#currentSort,
      onSortChange: this.#handleSortChange.bind(this)
    });
    render(sortComponent, this.#sortContainer);
  }

  #getSortedPoints() {
    const points = [...this.#model.points];

    switch (this.#currentSort) {
      case 'time':
        return points.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });
      case 'price':
        return points.sort((a, b) => b.basePrice - a.basePrice);
      case 'day':
      default:
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }
  }

  #reorderPoints() {
    const sortedPoints = this.#getSortedPoints();

    const listElement = this.#tripEventsContainer.querySelector('.trip-events__list');
    if (!listElement) {
      return;
    }

    const items = listElement.querySelectorAll('.trip-events__item');
    const itemMap = new Map();
    items.forEach((item) => {
      const pointId = item.dataset.pointId;
      if (pointId) {
        itemMap.set(pointId, item);
      }
    });

    sortedPoints.forEach((point) => {
      const item = itemMap.get(point.id);
      if (item) {
        listElement.append(item);
      }
    });
  }

  #clearTripEvents() {
    for (const [, presenter] of this.#pointPresenters) {
      presenter.destroy();
    }
    this.#pointPresenters.clear();

    const list = this.#tripEventsContainer.querySelector('.trip-events__list');
    if (list) {
      list.remove();
    }

    const empty = this.#tripEventsContainer.querySelector('.trip-events__msg');
    if (empty) {
      empty.remove();
    }
  }

  #renderTripEvents() {
    const points = this.#getSortedPoints();
    const destinations = this.#model.destinations;
    const allOffers = this.#model.offers;

    this.#clearTripEvents();

    if (points.length === 0) {
      this.#renderEmpty('everything');
      return;
    }

    const addFormComponent = new AddFormView({
      allDestinations: destinations
    });
    render(addFormComponent, this.#tripEventsContainer);

    const listElement = document.createElement('ul');
    listElement.className = 'trip-events__list';
    this.#tripEventsContainer.append(listElement);

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      this.#renderPoint(point, destinations, allOffers, listElement);
    }
  }

  #renderPoint(point, destinations, allOffers, container) {
    const pointPresenter = new PointPresenter({
      point: point,
      destinations: destinations,
      allOffers: allOffers,
      onDataChange: this.#handleDataChange.bind(this),
      onModeChange: this.#handleModeChange.bind(this)
    });

    this.#pointPresenters.set(point.id, pointPresenter);
    pointPresenter.init(container);
  }

  #renderEmpty(filterType) {
    const emptyComponent = new TripEmptyView({ filterType });
    render(emptyComponent, this.#tripEventsContainer);
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSort === sortType) {
      return;
    }

    this.#currentSort = sortType;
    this.#reorderPoints();
  };

  #handleDataChange = (updatedPoint) => {
    const points = this.#model.points;
    const index = points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      return;
    }

    points[index] = updatedPoint;

    const presenter = this.#pointPresenters.get(updatedPoint.id);
    if (presenter) {
      presenter.updatePoint(updatedPoint);
    }
  };

  #handleModeChange = () => {
    this.#closeAllEdits();
  };

  #closeAllEdits() {
    for (const [, presenter] of this.#pointPresenters) {
      presenter.resetView();
    }
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#closeAllEdits();
    }
  };
}
