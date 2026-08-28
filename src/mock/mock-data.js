import { TYPES } from '../model/type.js';
import dayjs from 'dayjs';

// Города
const CITIES = [
  'Amsterdam',
  'Geneva',
  'Chamonix',
  'Paris',
  'London',
  'Berlin',
  'Rome',
  'Madrid'
];

// Описания для городов
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function generateId() {
  return String(Date.now() + Math.random());
}

// Генерация пункта назначения
export function generateDestination(id) {
  const city = getRandomItem(CITIES);
  const descriptionCount = getRandomInt(1, 5);
  const descriptions = [];
  for (let i = 0; i < descriptionCount; i++) {
    descriptions.push(getRandomItem(DESCRIPTIONS));
  }

  return {
    id: id || generateId(),
    name: city,
    description: descriptions.join(' '),
    pictures: Array.from({ length: getRandomInt(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInt(0, 1000)}`,
      description: `Photo of ${city}`
    }))
  };
}

// Генерация опций для типа
export function generateOffersForType(type) {
  const offerTemplates = {
    taxi: [
      { title: 'Order Uber', price: 20 },
      { title: 'Add luggage', price: 10 },
      { title: 'Premium class', price: 50 }
    ],
    bus: [
      { title: 'Add luggage', price: 15 },
      { title: 'Reserve seat', price: 5 },
      { title: 'Wi-Fi', price: 8 }
    ],
    train: [
      { title: 'Meal', price: 15 },
      { title: 'Comfort class', price: 30 },
      { title: 'Seat reservation', price: 10 }
    ],
    ship: [
      { title: 'Meal', price: 25 },
      { title: 'Cabin upgrade', price: 80 },
      { title: 'Bicycle', price: 20 }
    ],
    drive: [
      { title: 'GPS', price: 10 },
      { title: 'Child seat', price: 15 },
      { title: 'Insurance', price: 30 }
    ],
    flight: [
      { title: 'Add luggage', price: 50 },
      { title: 'Switch to comfort', price: 80 },
      { title: 'Add meal', price: 15 },
      { title: 'Choose seats', price: 5 }
    ],
    'check-in': [
      { title: 'Breakfast', price: 20 },
      { title: 'Late checkout', price: 30 },
      { title: 'Parking', price: 15 }
    ],
    sightseeing: [
      { title: 'Guide', price: 30 },
      { title: 'Audio guide', price: 10 },
      { title: 'Lunch', price: 25 }
    ],
    restaurant: [
      { title: 'Wine', price: 20 },
      { title: 'Dessert', price: 10 },
      { title: 'Private room', price: 50 }
    ]
  };

  const templates = offerTemplates[type] || [];
  return templates.map((template, index) => ({
    id: `${type}-offer-${index}`,
    title: template.title,
    price: template.price
  }));
}

// Генерация случайной даты в ISO формате (с учетом часового пояса)
function generateDate(from, to) {
  const fromTime = dayjs(from).valueOf();
  const toTime = dayjs(to).valueOf();
  const randomTime = fromTime + Math.random() * (toTime - fromTime);
  return dayjs(randomTime).toISOString();
}

// Генерация точки маршрута
export function generatePoint(destinations, offers) {
  const type = getRandomItem(TYPES);
  const destination = getRandomItem(destinations);

  // Выбираем случайные опции для этого типа
  const typeOffers = offers.filter((offer) =>
    offer.id.startsWith(type)
  );
  const selectedOffers = typeOffers
    .filter(() => Math.random() > 0.5)
    .map((offer) => offer.id);

  const now = dayjs();
  const future = now.add(getRandomInt(1, 30), 'day');

  const dateFrom = generateDate(now.toISOString(), future.toISOString());
  const dateTo = dayjs(dateFrom).add(getRandomInt(1, 5), 'hour').toISOString();

  return {
    id: generateId(),
    type,
    destination: destination.id,
    offers: selectedOffers,
    dateFrom,
    dateTo,
    basePrice: getRandomInt(10, 200),
    isFavorite: Math.random() > 0.7
  };
}

// Генерация всех данных
export function generateMockData(count = 5) {
  // 1. Генерируем пункты назначения
  const destinations = [
    generateDestination('dest-1'),
    generateDestination('dest-2'),
    generateDestination('dest-3')
  ];

  // 2. Генерируем опции для всех типов
  const allOffers = [];
  TYPES.forEach((type) => {
    allOffers.push(...generateOffersForType(type));
  });

  // 3. Генерируем точки маршрута
  const points = Array.from({ length: count }, () =>
    generatePoint(destinations, allOffers)
  );

  return {
    destinations,
    offers: allOffers,
    points
  };
}
