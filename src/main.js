import TripPresenter from './presenter/trip-presenter.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import FilterModel from './model/filter-model.js';
import Model from './model/model.js';

const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new Model();
const filterModel = new FilterModel();

// eslint-disable-next-line prefer-const
let filtersPresenter;

const tripPresenter = new TripPresenter({
  tripEventsContainer,
  sortContainer,
  pointsModel,
  filterModel,
  onDataChange: () => {
    filtersPresenter?.init();
  },
});

filtersPresenter = new FiltersPresenter({
  filtersContainer,
  filtersModel: filterModel,
  pointsModel,
  onFilterChange: (filterType) => {
    filterModel.filter = filterType;
    tripPresenter.init();
  },
});

newEventButton.addEventListener('click', () => {
  tripPresenter.createPoint();
});

tripPresenter.init();
filtersPresenter.init();

