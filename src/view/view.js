import './view.css';

/**
 * @param {TemplateStringsArray} strings
 * @param  {...*} values
 * @return {string}
 */
export const html = (strings, ...values) =>
  values.reduce((result, value, index) => {

    if (value?.isViewConstructor) {
      value = `<${value}></${value}>`;
    } else

    if (Array.isArray(value)) {
      value = value.join('');
    }

    return result + value + strings[index + 1];

  }, strings[0]);

export default class View extends HTMLElement {
  constructor() {
    super();

    this.insertAdjacentHTML(
      this.adjacentHtmlPosition,
      this.createTemplate(...arguments)
    );
  }

  /**
   * @type {InsertPosition}
   */
  get adjacentHtmlPosition() {
    return 'beforeend';
  }

  createTemplate() {
    return html`${[...arguments]}`;
  }

  /**
   * @param {boolean} flag
   */
  display(flag) {
    this.hidden = !flag;

    return this;
  }

  shake() {
    this.classList.add('shake');

    this.addEventListener('animationend', () => {
      this.classList.remove('shake');
    }, {
      once: true
    });
  }

  static get isViewConstructor() {
    return true;
  }

  static get tagNamePrefix() {
    return 'trip';
  }

  static get tagName() {
    const hyphenCaseName = this.name.replace(/[A-Z]/g, '-$&').toLowerCase();

    return this.tagNamePrefix + hyphenCaseName.replace(/-view$/, '');
  }

  static toString() {
    return this.tagName;
  }
}
