import FilterPredicate from './enum/filter-predicate.js';

import Store from './store/store.js';
import CollectionModel from './model/collection-model.js';
import DataTableModel from './model/data-table-model.js';
import ApplicationModel from './model/application-model.js';

import PointAdapter from './adapter/point-adapter.js';
import DestinationAdapter from './adapter/destination-adapter.js';
import OfferGroupAdapter from './adapter/offer-group-adapter.js';

import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import ListView from './view/list-view.js';
import EditorView from './view/editor-view.js';

import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import ListPresenter from './presenter/list-presenter.js';
import EditorPresenter from './presenter/editor-presenter.js';
import PlaceholderPresenter from './presenter/placeholder-presenter.js';
import CreateButtonPresenter from './presenter/create-button-presenter.js';
import Mode from './enum/mode.js';
import CreatorPresenter from './presenter/creator-presenter.js';
import CreatorView from './view/creator-view.js';
import SortPredicate from './enum/sort-predicate.js';

const BASE_URL = 'https://18.ecmascript.pages.academy/big-trip';
const POINTS_URL = `${BASE_URL}/points`;
const DESTINATIONS_URL = `${BASE_URL}/destinations`;
const OFFERS_URL = `${BASE_URL}/offers`;
const AUTH = 'Basic er1083jdzbdw';

/** @type {Store<Point>} */
const pointsStore = new Store(POINTS_URL, AUTH);

/** @type {Store<Destination>} */
const destinationsStore = new Store(DESTINATIONS_URL, AUTH);

/** @type {Store<OfferGroup>} */
const offerGroupsStore = new Store(OFFERS_URL, AUTH);

const pointsModel = new DataTableModel(pointsStore, (point) => new PointAdapter(point))
  .setFilter(FilterPredicate.EVERYTHING)
  .setSort(SortPredicate.DAY);

const destinationsModel = new CollectionModel(
  destinationsStore,
  (destination) => new DestinationAdapter(destination)
);

const offerGroupsModel = new CollectionModel(
  offerGroupsStore,
  (offerGroup) => new OfferGroupAdapter(offerGroup)
);

const applicationModel = new ApplicationModel(pointsModel, destinationsModel, offerGroupsModel);

/** @type {SortView} */
const sortView = document.querySelector(String(SortView));

/** @type {HTMLParagraphElement} */
const placeholderView = document.querySelector('.trip-events__msg');

/** @type {ListView} */
const listView = document.querySelector(String(ListView));

/** @type {HTMLButtonElement} */
const createButtonView = document.querySelector('.trip-main__event-add-btn');

/** @type {FilterView} */
const filterView = document.querySelector(String(FilterView));

const creatorView = new CreatorView().target(listView);

const initializeApp = async () => {
  await applicationModel.ready();

  new FilterPresenter(applicationModel, filterView);
  new SortPresenter(applicationModel, sortView);
  new ListPresenter(applicationModel, listView);
  new EditorPresenter(applicationModel, new EditorView());
  new CreatorPresenter(applicationModel, creatorView);
  new PlaceholderPresenter(applicationModel, placeholderView);
  new CreateButtonPresenter(applicationModel, createButtonView);
};

initializeApp();


const {trace} = console;

applicationModel.addEventListener('mode', () => {
  trace(`%cMode.${Mode.findKey(applicationModel.getMode())}`, 'font-size: large');
});

pointsModel.addEventListener(['add', 'update', 'remove', 'filter', 'sort'], (event) => {
  trace(`%c${event.type}`, 'font-weight: bold');
});

