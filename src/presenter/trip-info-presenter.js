import { render, replace, remove } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    const points = this.#pointsModel.points;

    const route = this.#getRoute(points);
    const dates = this.#getDates(points);
    const cost = this.#getCost(points);

    const prevComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({ route, dates, cost });

    if (prevComponent) {
      replace(this.#tripInfoComponent, prevComponent);
      remove(prevComponent);
    } else {
      render(this.#tripInfoComponent, this.#container, 'afterbegin');
    }
  }

  #getRoute(points) {
    if (points.length === 0) {
      return '';
    }

    const sorted = [...points].sort((a, b) =>
      new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    const cities = sorted.map((point) => {
      const destination = this.#pointsModel.getDestinationById(point.destination);
      return destination?.name || '';
    }).filter(Boolean);

    if (cities.length <= 3) {
      return cities.join(' — ');
    }

    return `${cities[0]} — ... — ${cities[cities.length - 1]}`;
  }

  #getDates(points) {
    if (points.length === 0) {
      return '';
    }

    const sorted = [...points].sort((a, b) =>
      new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    const dateFrom = new Date(sorted[0].dateFrom);
    const dateTo = new Date(sorted[sorted.length - 1].dateTo);

    const formatDay = (d) => d.getDate();
    const formatMonth = (d) => d.toLocaleString('en-US', { month: 'short' }).toUpperCase();

    const from = `${formatDay(dateFrom)} ${formatMonth(dateFrom)}`;
    const to = `${formatDay(dateTo)} ${formatMonth(dateTo)}`;

    return `${from} — ${to}`;
  }

  #getCost(points) {
    return points.reduce((sum, point) => {
      const offersCost = this.#pointsModel
        .getOffersByIds(point.offers)
        .reduce((s, offer) => s + offer.price, 0);
      return sum + point.basePrice + offersCost;
    }, 0);
  }
}
