import Mode from '../enum/mode.js';
import CreatorPresenter from './creator-presenter.js';
import PointView from '../view/point-view.js';

/**
 * @template {ApplicationModel} Model
 * @template {EditorView} View
 * @extends {CreatorPresenter<Model,View>}
 */
export default class EditorPresenter extends CreatorPresenter {
  /**
   * @override
   */
  saveActivePoint() {
    const {activePoint} = this.model;

    return this.model.pointsModel.update(activePoint.id, activePoint);
  }

  /**
   * @override
   */
  onModelModeChange() {
    this.point = this.model.activePoint;

    this.view.close(false);

    if (this.model.getMode() === Mode.EDIT) {
      const pointView = PointView.findById(this.model.activePoint.id);

      this.updateView();
      this.view.target(pointView).open();
    }
  }

  /**
   * @override
   * @param {Event} event
   */
  async onViewReset(event) {
    event.preventDefault();

    this.view.setDeleting(true);

    try {
      await this.deleteActivePoint();
      this.view.close();

    } catch (exception) {
      this.view.shake();
    }

    this.view.setDeleting(false);
  }

  deleteActivePoint() {
    return this.model.pointsModel.remove(this.model.activePoint.id);
  }
}
