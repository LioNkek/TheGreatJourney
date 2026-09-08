import AbstractView from '../framework/view/abstract-view.js';

function createSortTemplate(currentSort) {
  const sorts = [
    { type: 'day', label: 'Day', isDisabled: false },
    { type: 'event', label: 'Event', isDisabled: true },
    { type: 'time', label: 'Time', isDisabled: false },
    { type: 'price', label: 'Price', isDisabled: false },
    { type: 'offer', label: 'Offers', isDisabled: true }
  ];

  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${sorts.map((sort) => `
        <div class="trip-sort__item trip-sort__item--${sort.type}">
          <input
            id="sort-${sort.type}"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-${sort.type}"
            data-sort-type="${sort.type}"
            ${currentSort === sort.type ? 'checked' : ''}
            ${sort.isDisabled ? 'disabled' : ''}
          >
          <label class="trip-sort__btn" for="sort-${sort.type}">
            ${sort.label}
          </label>
        </div>
      `).join('')}
    </form>
  `;
}

export default class SortView extends AbstractView {
  #currentSort = null;
  #handleSortChange = null;

  constructor({ currentSort, onSortChange }) {
    super();
    this.#currentSort = currentSort;
    this.#handleSortChange = onSortChange;

    this.element.addEventListener('change', this.#sortChangeHandler.bind(this));
  }

  #sortChangeHandler(evt) {
    const sortType = evt.target.dataset.sortType;
    if (!sortType) {
      return;
    }

    this.#handleSortChange?.(sortType);
  }

  get template() {
    return createSortTemplate(this.#currentSort);
  }
}
