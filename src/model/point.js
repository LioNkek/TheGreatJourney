export class Point {
  constructor({ id, type, destination, offers, dateFrom, dateTo, basePrice, isFavorite }) {
    this.id = id;
    this.type = type;
    this.destination = destination;
    this.offers = offers;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.basePrice = basePrice;
    this.isFavorite = isFavorite || false;
  }
}
