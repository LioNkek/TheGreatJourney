import ApiService from '../framework/api-service.js';
import { adaptPointToServer } from '../utils/adapter.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return ApiService.parseResponse(response);
  }

  async createPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }
}


