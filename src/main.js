import TripPresenter from './presenter/trip-presenter.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import FilterModel from './model/filter-model.js';
import Model from './model/model.js';
import PointsApiService from './api/points-api-service.js';
import LoadingView from './view/loading-view.js';
import { render, remove } from './framework/render.js';
import {
  adaptPointToClient,
  adaptDestinationToClient,
  adaptOffersToClient,
} from './utils/adapter.js';
import UiBlocker from './framework/ui-blocker/ui-blocker.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

const AUTHORIZATION = 'Basic jht76fdshj2389sdf';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');
const tripInfoContainer = document.querySelector('.trip-main');

const filterModel = new FilterModel();
const apiService = new PointsApiService(END_POINT, AUTHORIZATION);
const pointsModel = new Model(apiService);
const uiBlocker = new UiBlocker(300, 1000);
const tripInfoPresenter = new TripInfoPresenter({
  container: tripInfoContainer,
  pointsModel,
});

const loadingComponent = new LoadingView();
render(loadingComponent, tripEventsContainer);

Promise.all([
  apiService.points,
  apiService.destinations,
  apiService.offers,
])
  .then(([points, destinations, offers]) => {
    pointsModel.points = points.map(adaptPointToClient);
    pointsModel.destinations = destinations.map(adaptDestinationToClient);
    pointsModel.offers = adaptOffersToClient(offers);

    remove(loadingComponent);

    tripInfoPresenter.init();

    let filtersPresenter;

    const tripPresenter = new TripPresenter({
      tripEventsContainer,
      sortContainer,
      pointsModel,
      filterModel,
      uiBlocker,
      onDataChange: () => {
        filtersPresenter?.init();
        tripInfoPresenter?.init();
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

    newEventButton.addEventListener('click', () => tripPresenter.createPoint());

    tripPresenter.init();
    filtersPresenter.init();
  })
  .catch((err) => {
    console.error('Ошибка загрузки:', err);
    remove(loadingComponent);

    const failedContainer = document.createElement('p');
    failedContainer.className = 'trip-events__msg';
    failedContainer.textContent = 'Failed to load latest route information';
    tripEventsContainer.append(failedContainer);
  });
