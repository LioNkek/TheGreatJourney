import { render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import EditFormView from '../view/edit-form-view.js';
import TripEmptyView from '../view/trip-empty-view.js';
import PointPresenter from './point-presenter.js';
import { UserAction } from '../const.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #sortContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #currentSort = 'day';
  #pointPresenters = new Map();
  #onDataChange = null;

  constructor({ tripEventsContainer, sortContainer, pointsModel, filterModel, onDataChange }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#sortContainer = sortContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#onDataChange = onDataChange; // ← ТЕПЕРЬ ПЕРЕДАЁТСЯ
  }

  init() {
    this.#currentSort = 'day';
    this.#renderSort();
    this.#renderTripEvents();

    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  createPoint() {
    this.#filterModel.filter = 'everything';
    this.#currentSort = 'day';

    this.#closeAllEdits();

    this.#renderSort();
    this.#renderTripEvents(true);
  }

  #getFilteredPoints() {
    const points = this.#pointsModel.points;
    const filter = this.#filterModel.filter;
    const now = new Date();

    switch (filter) {
      case 'future':
        return points.filter((point) => new Date(point.dateFrom) > now);
      case 'present':
        return points.filter((point) => {
          const from = new Date(point.dateFrom);
          const to = new Date(point.dateTo);
          return from <= now && to >= now;
        });
      case 'past':
        return points.filter((point) => new Date(point.dateTo) < now);
      case 'everything':
      default:
        return points;
    }
  }

  #getSortedPoints() {
    const points = [...this.#getFilteredPoints()];

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

  #renderSort() {
    const oldSort = this.#sortContainer.querySelector('.trip-sort');
    if (oldSort) {
      oldSort.remove();
    }

    const sortComponent = new SortView({
      currentSort: this.#currentSort,
      onSortChange: this.#handleSortChange.bind(this)
    });
    render(sortComponent, this.#sortContainer);
  }

  #renderTripEvents(isAdding = false) {
    const points = this.#getSortedPoints();
    const destinations = this.#pointsModel.destinations;
    const allOffers = this.#pointsModel.offers;

    this.#clearTripEvents();

    if (isAdding) {
      this.#renderAddForm(destinations, allOffers);
    }

    if (points.length === 0 && !isAdding) {
      this.#renderEmpty(this.#filterModel.filter);
      return;
    }

    const listElement = document.createElement('ul');
    listElement.className = 'trip-events__list';
    this.#tripEventsContainer.append(listElement);

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      this.#renderPoint(point, destinations, allOffers, listElement);
    }
  }

  #renderAddForm(destinations, allOffers) {
    const addFormComponent = new EditFormView({
      point: {
        id: `new-${Date.now()}`,
        type: 'flight',
        destination: '',
        offers: [],
        dateFrom: '',
        dateTo: '',
        basePrice: 0,
        isFavorite: false
      },
      destination: null,
      offers: [],
      allOffers: allOffers,
      allDestinations: destinations,
      isNew: true,
      formId: 'new',
      onFormSubmit: (newPoint) => {
        this.#handleDataChange(UserAction.ADD_POINT, newPoint);
      },
      onRollupClick: () => {
        this.#renderTripEvents(false);
      }
    });
    render(addFormComponent, this.#tripEventsContainer);
  }

  #renderEmpty(filterType) {
    const emptyComponent = new TripEmptyView({ filterType });
    render(emptyComponent, this.#tripEventsContainer);
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

    const addForm = this.#tripEventsContainer.querySelector('.trip-events__item');
    if (addForm) {
      addForm.remove();
    }
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSort === sortType) {
      return;
    }

    this.#currentSort = sortType;
    this.#renderSort();
    this.#renderTripEvents();
  };

  #handleDataChange = async (actionType, updatedPoint) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT: {
        const adaptedPoint = await this.#pointsModel.updatePoint(updatedPoint);

        const presenter = this.#pointPresenters.get(adaptedPoint.id);
        if (presenter) {
          presenter.updatePoint(adaptedPoint);
        }
        break;
      }

      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updatedPoint.id);
        this.#pointPresenters.get(updatedPoint.id)?.destroy();
        this.#pointPresenters.delete(updatedPoint.id);
        this.#renderTripEvents();
        this.#onDataChange?.();
        break;

      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updatedPoint);
        this.#renderTripEvents();
        this.#onDataChange?.();
        break;

      default:
        break;
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
      const addForm = this.#tripEventsContainer.querySelector('.trip-events__item[data-point-id^="new-"]');
      if (addForm) {
        this.#renderTripEvents(false);
      }
    }
  };
}
