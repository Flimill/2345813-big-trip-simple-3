import Model from './model.js';

/**
 * @template Item
 * @template {Adapter} ItemAdapter
 */
export default class CollectionModel extends Model {
  /** @type {Item[]} */
  #items;

  #store;
  #adapt;

  /**
   * @param {Store<Item>} store
   * @param {(item?: Item) => ItemAdapter} adapt
   */
  constructor(store, adapt) {
    super();

    this.#store = store;
    this.#adapt = adapt;
  }

  get blank() {
    return this.#adapt();
  }

  /**
   * @override
   */
  async ready() {
    if (!this.#items) {
      this.#items = await this.#store.list();
    }
  }

  listAll() {
    return this.#items.map(this.#adapt);
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  findBy(key, value) {
    return this.listAll().find((item) => item[key] === value);
  }

  /**
   * @param {ItemId} value
   */
  findById(value) {
    return this.findBy('id', value);
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  findIndexBy(key, value) {
    return this.listAll().findIndex((item) => item[key] === value);
  }

  /**
   * @param {ItemId} value
   */
  findIndexById(value) {
    return this.findIndexBy('id', value);
  }

  item(index) {
    const item = this.#items[index];

    return item && this.#adapt(item);
  }

  /**
   * @param {ItemAdapter} item
   */
  async add(item) {
    const newItem = await this.#store.add(item.toJSON());
    const detail = this.#adapt(newItem);

    this.#items.push(newItem);

    this.dispatchEvent(new CustomEvent('add', {detail}));
  }

  /**
   * @param {ItemId} id
   * @param {ItemAdapter} item
   */
  async update(id, item) {
    const updatedItem = await this.#store.update(id, item.toJSON());
    const index = this.findIndexById(id);
    const detail = [this.item(index), this.#adapt(updatedItem)];

    this.#items.splice(index, 1, updatedItem);

    this.dispatchEvent(new CustomEvent('update', {detail}));
  }

  /**
   * @param {ItemId} id
   */
  async remove(id) {
    await this.#store.remove(id);

    const index = this.findIndexById(id);
    const [removedItem] = this.#items.splice(index, 1);
    const detail = this.#adapt(removedItem);

    this.dispatchEvent(new CustomEvent('remove', {detail}));
  }
}
