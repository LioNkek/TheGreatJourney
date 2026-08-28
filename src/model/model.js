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

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get points() {
    return this.#points;
  }

  getDestinationById(id) {
    return this.#destinations.find((dest) => dest.id === id);
  }

  getOffersByType(type) {
    return this.#offers.filter((offer) => offer.id.startsWith(type));
  }

  getOffersByIds(ids) {
    return this.#offers.filter((offer) => ids.includes(offer.id));
  }
}
