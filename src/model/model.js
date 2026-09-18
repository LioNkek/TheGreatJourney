import { adaptPointToClient } from '../utils/adapter.js';

export default class Model {
  #destinations = [];
  #offers = [];
  #points = [];
  #apiService = null;

  constructor(apiService) {
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = offers;
  }

  getDestinationById(id) {
    return this.#destinations.find((dest) => dest.id === id);
  }

  getOffersByIds(ids) {
    return this.#offers.filter((offer) => ids.includes(offer.id));
  }

  async updatePoint(updatedPoint) {
    const response = await this.#apiService.updatePoint(updatedPoint);
    const adaptedPoint = adaptPointToClient(response);
    this.#points = this.#points.map((point) =>
      point.id === adaptedPoint.id ? adaptedPoint : point
    );
    return adaptedPoint;
  }

  deletePoint(pointId) {
    this.#points = this.#points.filter((point) => point.id !== pointId);
  }

  addPoint(point) {
    this.#points = [...this.#points, point];
  }
}
