export function adaptPointToClient(point) {
  return {
    id: point.id,
    type: point.type,
    destination: point.destination,
    offers: point.offers,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    basePrice: point.base_price,
    isFavorite: point.is_favorite,
  };
}

export function adaptDestinationToClient(destination) {
  return {
    id: destination.id,
    name: destination.name,
    description: destination.description,
    pictures: destination.pictures,
  };
}

export function adaptOfferToClient(offer, type) {
  return {
    id: offer.id,
    title: offer.title,
    price: offer.price,
    type: type,
  };
}

export function adaptOffersToClient(offersGroup) {
  return offersGroup.flatMap((group) =>
    group.offers.map((offer) => adaptOfferToClient(offer, group.type))
  );
}

export function adaptPointToServer(point) {
  return {
    'type': point.type,
    'destination': point.destination,
    'offers': point.offers,
    'date_from': point.dateFrom,
    'date_to': point.dateTo,
    'base_price': point.basePrice,
    'is_favorite': point.isFavorite,
  };
}
