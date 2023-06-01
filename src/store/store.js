/**
 * @template Item
 */
export default class Store {
  #baseUrl;
  #auth;

  /**
   * @param {string} baseUrl
   * @param {string} auth
   */
  constructor(baseUrl, auth) {
    this.#baseUrl = baseUrl;
    this.#auth = auth;
  }

  /**
   * @returns {Promise<Item[]>}
   */
  list() {
    return this.request('/', {
      method: 'GET'
    });
  }

  /**
   * @param {Item} item
   * @returns {Promise<Item>}
   */
  add(item) {
    return this.request('/', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  }

  /**
   * @param {ItemId} id
   * @param {Item} item
   * @returns {Promise<Item>}
   */
  update(id, item) {
    return this.request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    });
  }

  /**
   * @param {ItemId} id
   * @returns {Promise<Item>}
   */
  remove(id) {
    return this.request(`/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * @param {string} path
   * @param {RequestInit} options
   */
  async request(path, options = {}) {
    const url = `${this.#baseUrl}${path}`;
    const headers = {
      'authorization': this.#auth,
      'content-type': 'application/json',
      ...options.headers
    };
    const response = await fetch(url, {...options, headers});
    const {parse} = /** @type {typeof Store} */(this.constructor);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return parse(response);
  }

  /**
   * @param {Response} response
   */
  static parse(response) {
    if (response.headers.get('content-type').startsWith('application/json')) {
      return response.json();
    }

    return response.text();
  }
}
