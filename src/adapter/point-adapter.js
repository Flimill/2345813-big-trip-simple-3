import Adapter from './adapter.js';

export default class PointAdapter extends Adapter {
  /**
   * @param {Partial<Point>} point
   */
  constructor(point = {}) {
    super();

    this.basePrice = point.base_price;
    this.startDate = point.date_from;
    this.endDate = point.date_to;
    this.destinationId = point.destination;
    this.id = Number(point.id);
    this.offerIds = point.offers?.slice();
    this.type = point.type;
    this.isFavorite = point.is_favorite;
  }

  /**
   * @override
   * @return {Partial<Point>}
   */
  toJSON() {
    return {
      'base_price': this.basePrice,
      'date_from': this.startDate,
      'date_to': this.endDate,
      'destination': this.destinationId,
      'id': String(this.id),
      'offers': this.offerIds,
      'type': this.type,
      'is_favorite': this.isFavorite
    };
  }
}
