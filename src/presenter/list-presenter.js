import Mode from '../enum/mode.js';
import PointType from '../enum/point-type.js';
import PointLabel from '../enum/point-label.js';
import Presenter from './presenter.js';
import { formatDate, formatNumber } from '../format.js';

const DateFormat = {
  TIME: 'HH:mm',
  CALENDAR_DATE: 'MMM D'
};

/**
 * @template {ApplicationModel} Model
 * @template {ListView} View
 * @extends {Presenter<Model,View>}
 */
export default class ListPresenter extends Presenter {
  /**
   * @param {[model: Model, view: View]} args
   */
  constructor(...args) {
    super(...args);

    this.updateView();

    this.view.addEventListener('edit', this.onPointViewEdit.bind(this));

    this.model.pointsModel.addEventListener(
      ['add', 'update', 'remove', 'filter', 'sort'],
      this.onModelPointsChange.bind(this)
    );
  }

  updateView() {
    const points = this.model.pointsModel.list();

    const states = points.map((point) => {
      const {startDate, endDate} = point;
      const destination = this.model.destinationsModel.findById(point.destinationId);
      const typeLabel = PointLabel[PointType.findKey(point.type)];
      const title = `${typeLabel} ${destination.name}`;
      const offerGroup = this.model.offerGroupsModel.findById(point.type);

      const offerStates = offerGroup.items.reduce((result, offer) => {
        if (point.offerIds.includes(offer.id)) {
          result.push([offer.title, offer.price]);
        }

        return result;
      }, []);

      return {
        id: point.id,
        type: point.type,
        startIsoDate: startDate,
        endIsoDate: endDate,
        title,
        icon: point.type,
        startDate: formatDate(startDate, DateFormat.CALENDAR_DATE),
        startTime: formatDate(startDate, DateFormat.TIME),
        endTime: formatDate(endDate, DateFormat.TIME),
        price: formatNumber(point.basePrice),
        offers: offerStates
      };
    });

    this.view.setPoints(states);
  }

  onModelPointsChange() {
    this.updateView();
  }

  /**
   * @param {CustomEvent & {target: PointView}} event
   */
  onPointViewEdit(event) {
    this.model.setMode(Mode.EDIT, event.target.getId());
  }
}
