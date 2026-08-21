import { render } from '../render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventView from '../view/event-view.js';
import EditFormView from '../view/edit-form-view.js';
import AddFormView from '../view/add-form-view.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #filtersContainer = null;
  #sortContainer = null;

  constructor({ tripEventsContainer, filtersContainer, sortContainer }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#filtersContainer = filtersContainer;
    this.#sortContainer = sortContainer;
  }

  init() {
    // 1. Отрисовываем фильтры
    this.#renderFilters();

    // 2. Отрисовываем сортировку
    this.#renderSort();

    // 3. Отрисовываем список точек маршрута
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
    // 1. Форма создания (добавляем!)
    const addFormComponent = new AddFormView();
    render(addFormComponent, this.#tripEventsContainer);

    // 2. Форма редактирования
    const editFormComponent = new EditFormView();
    render(editFormComponent, this.#tripEventsContainer);

    // 3. 3 точки маршрута
    for (let i = 0; i < 3; i++) {
      const eventComponent = new EventView();
      render(eventComponent, this.#tripEventsContainer);
    }
  }
}
