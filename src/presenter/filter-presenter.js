import Mode from '../enum/mode.js';
import FilterType from '../enum/filter-type.js';
import FilterLabel from '../enum/filter-label.js';
import FilterPredicate from '../enum/filter-predicate.js';
import Presenter from './presenter.js';

/**
 * @template {ApplicationModel} Model
 * @template {FilterView} View
 * @extends {Presenter<Model,View>}
 */
export default class FilterPresenter extends Presenter {
  /**
   * @param {[model: Model, view: View]} args
   */
  constructor(...args) {
    super(...args);

    this.buildView();

    this.view.addEventListener('change', this.onViewChange.bind(this));
    this.model.addEventListener('mode', this.onModelChange.bind(this));

    this.model.pointsModel.addEventListener(
      ['add', 'remove', 'update'],
      this.onPointsModelChange.bind(this)
    );
  }

  buildView() {
    /** @type {[string, string][]} */
    const options = Object.keys(FilterType).map(
      (key) => [FilterLabel[key], FilterType[key]]
    );

    this.view.setOptions(options);
    this.updateViewOptionsDisabled();
    this.updateViewValue();
  }

  updateViewValue() {
    const predicate = this.model.pointsModel.getFilter();
    const type = FilterType[FilterPredicate.findKey(predicate)];

    this.view.setValue(type);
  }

  updateViewOptionsDisabled() {
    const predicates = Object.values(FilterPredicate);
    const states = predicates.map((predicate) =>
      !this.model.pointsModel.list(predicate).length);

    this.view.setOptionsDisabled(states);
  }

  onViewChange() {
    const value = this.view.getValue();
    const predicate = FilterPredicate[FilterType.findKey(value)];

    this.model.setMode(Mode.VIEW);
    this.model.pointsModel.setFilter(predicate);
  }

  onPointsModelChange() {
    this.updateViewOptionsDisabled();
  }

  onModelChange() {
    if (this.model.getMode() === Mode.CREATE) {
      this.model.pointsModel.setFilter(FilterPredicate.defaultValue);

      this.updateViewValue();
    }
  }
}
