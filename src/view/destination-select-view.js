import './destination-select-view.css';
import View, {html} from './view.js';

export default class DestinationSelectView extends View {
  #options;

  constructor() {
    super(...arguments);

    /** @type {HTMLLabelElement} */
    this.labelView = this.querySelector('.event__type-output');

    /** @type {HTMLInputElement} */
    this.inputView = this.querySelector('.event__input--destination');

    /** @type {HTMLDataListElement} */
    this.datalistView = this.querySelector('datalist');

    this.classList.add('event__field-group', 'event__field-group--destination');

    this.addEventListener('focus', this.onFocus, true);
    this.addEventListener('change', this.onChange);
    this.addEventListener('keydown', this.onKeydown);
    this.addEventListener('blur', this.onBlur, true);
  }

  get allowedKeys() {
    return ['Tab', 'ArrowUp', 'ArrowDown', 'Escape', 'Esc'];
  }

  /**
   * @override
   */
  createTemplate() {
    return html`
      <label
        class="event__label  event__type-output"
        for="event-destination-1"
      ></label>
      <input
        class="event__input event__input--destination"
        id="event-destination-1"
        type="text"
        name="event-destination"
        value=""
        list="destination-list-1"
        required
      >
      <datalist id="destination-list-1"></datalist>
    `;
  }

  getValue() {
    return this.inputView.value || this.inputView.placeholder;
  }

  /**
   * @param {string} value
   */
  setValue(value) {
    this.inputView.value = value;

    return this;
  }

  /**
   * @param {string} label
   */
  setLabel(label) {
    const view = this.querySelector('.event__type-output');

    view.textContent = label;

    return this;
  }

  /**
   * @param {[string, string][]} states
   */
  setOptions(states) {
    const views = states.map((state) => new Option(...state));

    this.datalistView.replaceChildren(...views);
    this.#options = states;

    return this;
  }

  replaceValueWithPlaceholder() {
    const { inputView } = this;

    inputView.placeholder = inputView.value;
    inputView.value = '';
  }

  replacePlaceholderWithValue() {
    const { inputView } = this;

    inputView.value = inputView.placeholder;
    inputView.placeholder = '';
  }

  onFocus() {
    this.replaceValueWithPlaceholder();
  }

  onChange() {
    this.replaceValueWithPlaceholder();
  }

  onKeydown(event) {
    if (!this.allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onBlur() {
    this.replacePlaceholderWithValue();
  }
}

customElements.define(String(DestinationSelectView), DestinationSelectView);
