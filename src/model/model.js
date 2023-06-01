export default class Model extends EventTarget {
  /**
   * @override
   * @param {string | string[]} type
   * @param {EventListener | EventListenerObject} listener
   * @param {boolean | EventListenerOptions} options
   */
  addEventListener(type, listener, options = false) {
    [].concat(type).forEach((name) => {
      super.addEventListener(name, listener, options);
    });
  }

  async ready() {}
}
