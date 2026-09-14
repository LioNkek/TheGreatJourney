import { render } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filtersModel = null;
  #pointsModel = null;
  #handleFilterChange = null;

  constructor({ filtersContainer, filtersModel, pointsModel, onFilterChange }) {
    this.#filtersContainer = filtersContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
    this.#handleFilterChange = onFilterChange;
  }

  init() {
    this.#renderFilters();
  }

  #renderFilters() {
    this.#filtersContainer.innerHTML = '';

    const filters = this.#getFilters();
    const filtersComponent = new FiltersView({
      filters,
      onFilterChange: this.#handleFilterChange
    });
    render(filtersComponent, this.#filtersContainer);
  }

  #getFilters() {
    const points = this.#pointsModel.points;
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
      everything: points.length,
      future: futurePoints.length,
      present: presentPoints.length,
      past: pastPoints.length
    };

    return filterTypes.map((filter) => ({
      type: filter.type,
      name: filter.name,
      checked: filter.type === this.#filtersModel.filter,
      disabled: counts[filter.type] === 0
    }));
  }
}
