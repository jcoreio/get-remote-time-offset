"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRemoteTimeOffset = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _isFinite = require("babel-runtime/core-js/number/is-finite");

var _isFinite2 = _interopRequireDefault(_isFinite);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getRemoteTimeOffset = exports.getRemoteTimeOffset = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(fetchRemoteTime) {
    var run = function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var _this = this;

        var results, numRejections, _loop, samples, avgOffset, avgLatency;

        return _regenerator2.default.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                results = [];
                numRejections = 0;
                _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop() {
                  var startTime, time, endTime, _offset, _latency, delay;

                  return _regenerator2.default.wrap(function _loop$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          startTime = Date.now();
                          _context.prev = 1;
                          _context.next = 4;
                          return fetchRemoteTime();

                        case 4:
                          time = _context.sent;
                          endTime = Date.now();

                          if (!(time == null)) {
                            _context.next = 8;
                            break;
                          }

                          throw new Error("time cannot be null or undefined");

                        case 8:
                          if (!isNaN(time)) {
                            _context.next = 10;
                            break;
                          }

                          throw new Error("time cannot be NaN");

                        case 10:
                          if ((0, _isFinite2.default)(time)) {
                            _context.next = 12;
                            break;
                          }

                          throw new Error("time cannot be infinite");

                        case 12:
                          if (!(time < 0)) {
                            _context.next = 14;
                            break;
                          }

                          throw new Error("time is out of range: " + time);

                        case 14:
                          _offset = time - endTime;
                          _latency = endTime - startTime;
                          // istanbul ignore next

                          if (!(_latency < 0)) {
                            _context.next = 18;
                            break;
                          }

                          throw new Error("latency cannot be less than zero: " + _latency);

                        case 18:
                          results.push({ offset: _offset, latency: _latency });
                          _context.next = 26;
                          break;

                        case 21:
                          _context.prev = 21;
                          _context.t0 = _context["catch"](1);

                          numRejections++;

                          if (!(numRejections >= maxRejections)) {
                            _context.next = 26;
                            break;
                          }

                          throw _context.t0;

                        case 26:
                          delay = Math.max(0, startTime + timeBetweenQueries - Date.now());
                          _context.next = 29;
                          return new _promise2.default(function (resolve) {
                            return setTimeout(resolve, delay);
                          });

                        case 29:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _loop, _this, [[1, 21]]);
                });

              case 3:
                if (!(results.length < numQueries)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.delegateYield(_loop(), "t0", 5);

              case 5:
                _context2.next = 3;
                break;

              case 7:
                samples = results.slice(1);
                avgOffset = samples.reduce(function (prev, cur) {
                  return prev + cur.offset;
                }, 0) / samples.length;
                avgLatency = samples.reduce(function (prev, cur) {
                  return prev + cur.latency;
                }, 0) / samples.length;
                return _context2.abrupt("return", Math.floor(avgOffset + avgLatency / 2));

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this);
      }));

      return function run() {
        return _ref2.apply(this, arguments);
      };
    }();

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var numQueries, timeBetweenQueries, maxRejections, timeout;
    return _regenerator2.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            numQueries = options.numQueries || 5;
            timeBetweenQueries = options.timeBetweenQueries || 10;
            maxRejections = options.maxRejections || 0;
            timeout = options.timeout || numQueries * timeBetweenQueries * 10;

            if (!(!(0, _isFinite2.default)(numQueries) || numQueries < 0)) {
              _context3.next = 6;
              break;
            }

            throw new Error("invalid numQueries: " + numQueries);

          case 6:
            if (!(!(0, _isFinite2.default)(timeBetweenQueries) || timeBetweenQueries < 0)) {
              _context3.next = 8;
              break;
            }

            throw new Error("invalid timeBetweenQueries: " + timeBetweenQueries);

          case 8:
            if (!(!(0, _isFinite2.default)(timeout) || timeout < 0)) {
              _context3.next = 10;
              break;
            }

            throw new Error("invalid timeout: " + timeout);

          case 10:
            if (!(timeout < numQueries * timeBetweenQueries)) {
              _context3.next = 12;
              break;
            }

            throw new Error("timeout is too low to possibly finish: " + timeout);

          case 12:
            _context3.next = 14;
            return _promise2.default.race([run(), new _promise2.default(function (resolve, reject) {
              return setTimeout(function () {
                return reject(new Error('timed out'));
              }, timeout);
            })]);

          case 14:
            return _context3.abrupt("return", _context3.sent);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getRemoteTimeOffset(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }