'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DB = exports.DBAdapter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // eslint-disable-line no-unused-vars


var _query = require('kinvey-javascript-sdk-core/dist/query');

var _aggregation = require('kinvey-javascript-sdk-core/dist/aggregation');

var _errors = require('kinvey-javascript-sdk-core/dist/errors');

var _utils = require('kinvey-javascript-sdk-core/dist/utils');

var _storage = require('./storage');

var _indexeddb = require('./indexeddb');

var _websql = require('./websql');

var _es6Promise = require('es6-promise');

var _promiseQueue = require('promise-queue');

var _promiseQueue2 = _interopRequireDefault(_promiseQueue);

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _result = require('lodash/result');

var _result2 = _interopRequireDefault(_result);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _es6Promise.Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _es6Promise.Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var idAttribute = process.env.KINVEY_ID_ATTRIBUTE || '_id';
var kmdAttribute = process.env.KINVEY_KMD_ATTRIBUTE || '_kmd';
_promiseQueue2.default.configure(_es6Promise.Promise);
var queue = new _promiseQueue2.default(1, Infinity);

/**
 * Enum for DB Adapters.
 */
var DBAdapter = {
  IndexedDB: 'IndexedDB',
  LocalStorage: 'LocalStorage',
  SessionStorage: 'SessionStorage',
  WebSQL: 'WebSQL'
};
Object.freeze(DBAdapter);
exports.DBAdapter = DBAdapter;

/**
 * @private
 */

var DB = exports.DB = function () {
  function DB(name) {
    var _this = this;

    var adapters = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    _classCallCheck(this, DB);

    if (!name) {
      throw new _errors.KinveyError('Unable to create a DB instance without a name.');
    }

    if (!(0, _isString2.default)(name)) {
      throw new _errors.KinveyError('The name is not a string. A name must be a string to create a DB instance.');
    }

    if (!(0, _isArray2.default)(adapters)) {
      adapters = [adapters];
    }

    (0, _forEach2.default)(adapters, function (adapter) {
      switch (adapter) {
        case DBAdapter.IndexedDB:
          if (_indexeddb.IndexedDB.isSupported()) {
            _this.adapter = new _indexeddb.IndexedDB(name);
            return false;
          }

          break;
        case DBAdapter.LocalStorage:
          if (_storage.LocalStorage.isSupported()) {
            _this.adapter = new _storage.LocalStorage(name);
            return false;
          }

          break;
        case DBAdapter.SessionStorage:
          if (_storage.SessionStorage.isSupported()) {
            _this.adapter = new _storage.SessionStorage(name);
            return false;
          }

          break;
        case DBAdapter.WebSQL:
          if (_websql.WebSQL.isSupported()) {
            _this.adapter = new _websql.WebSQL(name);
            return false;
          }

          break;
        default:
          _utils.Log.warn('The ' + adapter + ' adapter is is not recognized.');
      }

      return true;
    });
  }

  _createClass(DB, [{
    key: 'generateObjectId',
    value: function generateObjectId() {
      var length = arguments.length <= 0 || arguments[0] === undefined ? 24 : arguments[0];

      var chars = 'abcdef0123456789';
      var objectId = '';

      for (var i = 0, j = chars.length; i < length; i++) {
        var pos = Math.floor(Math.random() * j);
        objectId += chars.substring(pos, pos + 1);
      }

      return objectId;
    }
  }, {
    key: 'find',
    value: function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee(collection, query) {
        var entities;
        return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.adapter.find(collection);

              case 3:
                entities = _context.sent;

                if (entities) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return', []);

              case 6:

                if (query && !(query instanceof _query.Query)) {
                  query = new _query.Query((0, _result2.default)(query, 'toJSON', query));
                }

                if (entities.length > 0 && query) {
                  entities = query.process(entities);
                }

                return _context.abrupt('return', entities);

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](0);

                if (!(_context.t0 instanceof _errors.NotFoundError)) {
                  _context.next = 15;
                  break;
                }

                return _context.abrupt('return', []);

              case 15:
                throw _context.t0;

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 11]]);
      }));

      function find(_x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return find;
    }()
  }, {
    key: 'findById',
    value: function () {
      var _ref2 = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee2(collection, id) {
        return _regeneratorRuntime2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if ((0, _isString2.default)(id)) {
                  _context2.next = 2;
                  break;
                }

                throw new _errors.KinveyError('id must be a string', id);

              case 2:
                return _context2.abrupt('return', this.adapter.findById(collection, id));

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function findById(_x5, _x6) {
        return _ref2.apply(this, arguments);
      }

      return findById;
    }()
  }, {
    key: 'count',
    value: function () {
      var _ref3 = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee3(collection, query) {
        var entities;
        return _regeneratorRuntime2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.find(collection, query);

              case 2:
                entities = _context3.sent;
                return _context3.abrupt('return', { count: entities.length });

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function count(_x7, _x8) {
        return _ref3.apply(this, arguments);
      }

      return count;
    }()
  }, {
    key: 'group',
    value: function () {
      var _ref4 = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee4(collection, aggregation) {
        var entities;
        return _regeneratorRuntime2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.find(collection);

              case 2:
                entities = _context4.sent;


                if (!(aggregation instanceof _aggregation.Aggregation)) {
                  aggregation = new _aggregation.Aggregation((0, _result2.default)(aggregation, 'toJSON', aggregation));
                }

                if (!(entities.length > 0 && aggregation)) {
                  _context4.next = 6;
                  break;
                }

                return _context4.abrupt('return', aggregation.process(entities));

              case 6:
                return _context4.abrupt('return', null);

              case 7:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function group(_x9, _x10) {
        return _ref4.apply(this, arguments);
      }

      return group;
    }()
  }, {
    key: 'save',
    value: function save(collection) {
      var _this2 = this;

      var entities = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      return queue.add(_asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee5() {
        var singular;
        return _regeneratorRuntime2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                singular = false;

                if (entities) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt('return', null);

              case 3:

                if (!(0, _isArray2.default)(entities)) {
                  singular = true;
                  entities = [entities];
                }

                entities = (0, _map2.default)(entities, function (entity) {
                  var id = entity[idAttribute];
                  var kmd = entity[kmdAttribute] || {};

                  if (!id) {
                    id = _this2.generateObjectId();
                    kmd.local = true;
                  }

                  entity[idAttribute] = id;
                  entity[kmdAttribute] = kmd;
                  return entity;
                });

                _context5.next = 7;
                return _this2.adapter.save(collection, entities);

              case 7:
                entities = _context5.sent;

                if (!(singular && entities.length > 0)) {
                  _context5.next = 10;
                  break;
                }

                return _context5.abrupt('return', entities[0]);

              case 10:
                return _context5.abrupt('return', entities);

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this2);
      })));
    }
  }, {
    key: 'remove',
    value: function () {
      var _ref6 = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee6(collection, query) {
        var _this3 = this;

        var entities, responses;
        return _regeneratorRuntime2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (query && !(query instanceof _query.Query)) {
                  query = new _query.Query(query);
                }

                // Removing should not take the query sort, limit, and skip into account.
                if (query) {
                  query.sort = null;
                  query.limit = null;
                  query.skip = 0;
                }

                _context6.next = 4;
                return this.find(collection, query);

              case 4:
                entities = _context6.sent;
                _context6.next = 7;
                return _es6Promise.Promise.all(entities.map(function (entity) {
                  return _this3.removeById(collection, entity[idAttribute]);
                }));

              case 7:
                responses = _context6.sent;
                return _context6.abrupt('return', (0, _reduce2.default)(responses, function (entities, entity) {
                  entities.push(entity);
                  return entities;
                }, []));

              case 9:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function remove(_x12, _x13) {
        return _ref6.apply(this, arguments);
      }

      return remove;
    }()
  }, {
    key: 'removeById',
    value: function removeById(collection, id) {
      var _this4 = this;

      return queue.add(function () {
        if (!id) {
          return undefined;
        }

        if (!(0, _isString2.default)(id)) {
          throw new _errors.KinveyError('id must be a string', id);
        }

        return _this4.adapter.removeById(collection, id);
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this5 = this;

      return queue.add(function () {
        return _this5.adapter.clear();
      });
    }
  }]);

  return DB;
}();