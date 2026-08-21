import TripPresenter from './presenter/trip-presenter.js';

const tripPresenter = new TripPresenter({
  tripEventsContainer: document.querySelector('.trip-events'),
  filtersContainer: document.querySelector('.trip-controls__filters'),
  sortContainer: document.querySelector('.trip-events'),
});

tripPresenter.init();
