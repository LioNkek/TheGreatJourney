import { generateMockData } from '../mock/mock-data.js';

export default class Model {
  #destinations = [];
  #offers = [];
  #points = [];

  constructor() {
    const mockData = generateMockData(5);
    this.#destinations = mockData.destinations;
    this.#offers = mockData.offers;
    this.#points = mockData.points;
  }

  //ТОЧКИ МАРШРУТА

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
  }

  deletePoint(pointId) {
    this.#points = this.#points.filter((point) => point.id !== pointId);
  }

  addPoint(point) {
    this.#points = [...this.#points, point];
  }

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);
    if (index === -1) {
      return;
    }
    this.#points[index] = updatedPoint;
  }

  getPointById(id) {
    return this.#points.find((point) => point.id === id);
  }

  //ПУНКТЫ НАЗНАЧЕНИЯ

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((dest) => dest.id === id);
  }

  //ОПЦИИ

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = offers;
  }

  getOffersByType(type) {
    return this.#offers.filter((offer) => offer.id.startsWith(type));
  }

  getOffersByIds(ids) {
    return this.#offers.filter((offer) => ids.includes(offer.id));
  }
}

