/** @typedef {[title: string, price: number]} State */

import View, {html} from './view.js';

export default class OfferView extends View {
  /**
   * @param  {State} state
   */
  constructor(...state) {
    super(...state);

    this.classList.add('event__offer');
  }

  /**
   * @override
   */
  createTemplate(title, price) {
    return html`
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    `;
  }
}

customElements.define(String(OfferView), OfferView);
