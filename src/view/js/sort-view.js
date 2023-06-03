import View, { html } from './view.js';

export default class SortView extends View {
  get inputSelector() {
    return '[type="radio"]';
  }

  /**
   * @type {NodeListOf<HTMLInputElement>}
   */
  get inputViews() {
    return this.querySelectorAll(this.inputSelector);
  }

  getValue() {
    /** @type {HTMLInputElement} */
    const inputCheckedView = this.querySelector(`${this.inputSelector}:checked`);

    if (inputCheckedView) {
      return inputCheckedView.value;
    }

    return '';
  }

  /**
   * @param {string} value
   */
  setValue(value) {
    /** @type {HTMLInputElement} */
    const inputView = this.querySelector(`${this.inputSelector}[value="${value}"]`);

    if (inputView) {
      inputView.checked = true;
    }

    return this;
  }

  getIndex() {
    return [...this.inputViews].findIndex((view) => view.checked);
  }

  /**
   * @param {number} index
   */
  setIndex(index, notify = true) {
    const views = this.inputViews;
    const rangeIndex = (views.length + index) % views.length;

    views.item(rangeIndex).checked = true;

    if (notify) {
      views.item(rangeIndex).dispatchEvent(new Event('change', { bubbles: true }));
    }

    return this;
  }

  /**
   * @param {boolean[]} flags
   */
  setOptionsDisabled(flags) {
    this.inputViews.forEach((view, index) => {
      view.disabled = flags[index];
    });

    return this;
  }
  /**
   * @override
   */

  createTemplate() {
    return html`
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get"></form>
    `;
  }

  /**
   * @param {SortOptionState} state
   */
  createOptionTemplate(state) {
    const [label, value] = state;

    return html`
      <div class="trip-sort__item trip-sort__item--${value}">
        <input
          id="sort-${value}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="${value}"
        >
        <label class="trip-sort__btn" for="sort-${value}">
          ${label}
        </label>
      </div>
    `;
  }

  /**
   * @param {SortOptionState[]} states
   */
  setOptions(states) {
    const templates = states.map(this.createOptionTemplate);

    this.querySelector('form').innerHTML = templates.join('');

    return this;
  }
}

customElements.define(String(SortView), SortView);
