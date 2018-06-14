'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _server = require('./helpers/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var s = void 0;

_ava2.default.before('setup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	var noStoreIndex, cacheIndex, status301Index, status302Index;
	return regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return (0, _server.createServer)();

				case 2:
					s = _context.sent;
					noStoreIndex = 0;

					s.on('/no-store', function (req, res) {
						res.setHeader('Cache-Control', 'public, no-cache, no-store');
						res.end(noStoreIndex.toString());
						noStoreIndex++;
					});

					cacheIndex = 0;

					s.on('/cache', function (req, res) {
						res.setHeader('Cache-Control', 'public, max-age=60');
						res.end(cacheIndex.toString());
						cacheIndex++;
					});

					status301Index = 0;

					s.on('/301', function (req, res) {
						if (status301Index === 0) {
							res.setHeader('Cache-Control', 'public, max-age=60');
							res.setHeader('Location', s.url + '/302');
							res.statusCode = 301;
						}
						res.end();
						status301Index++;
					});

					status302Index = 0;

					s.on('/302', function (req, res) {
						if (status302Index === 0) {
							res.setHeader('Cache-Control', 'public, max-age=60');
							res.setHeader('Location', s.url + '/cache');
							res.statusCode = 302;
						}
						res.end();
						status302Index++;
					});

					_context.next = 13;
					return s.listen(s.port);

				case 13:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

(0, _ava2.default)('Non cacheable responses are not cached', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		var endpoint, cache, firstResponseInt, secondResponseInt;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						endpoint = '/no-store';
						cache = new Map();
						_context2.t0 = Number;
						_context2.next = 5;
						return (0, _2.default)(s.url + endpoint, { cache: cache });

					case 5:
						_context2.t1 = _context2.sent.body;
						firstResponseInt = (0, _context2.t0)(_context2.t1);
						_context2.t2 = Number;
						_context2.next = 10;
						return (0, _2.default)(s.url + endpoint, { cache: cache });

					case 10:
						_context2.t3 = _context2.sent.body;
						secondResponseInt = (0, _context2.t2)(_context2.t3);


						t.is(cache.size, 0);
						t.true(firstResponseInt < secondResponseInt);

					case 14:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function (_x) {
		return _ref2.apply(this, arguments);
	};
}());

(0, _ava2.default)('Cacheable responses are cached', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var endpoint, cache, firstResponse, secondResponse;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						endpoint = '/cache';
						cache = new Map();
						_context3.next = 4;
						return (0, _2.default)(s.url + endpoint, { cache: cache });

					case 4:
						firstResponse = _context3.sent;
						_context3.next = 7;
						return (0, _2.default)(s.url + endpoint, { cache: cache });

					case 7:
						secondResponse = _context3.sent;


						t.is(cache.size, 1);
						t.is(firstResponse.body, secondResponse.body);

					case 10:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function (_x2) {
		return _ref3.apply(this, arguments);
	};
}());

(0, _ava2.default)('Cached response is re-encoded to current encoding option', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var endpoint, cache, firstEncoding, secondEncoding, firstResponse, secondResponse, expectedSecondResponseBody;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						endpoint = '/cache';
						cache = new Map();
						firstEncoding = 'base64';
						secondEncoding = 'hex';
						_context4.next = 6;
						return (0, _2.default)(s.url + endpoint, { cache: cache, encoding: firstEncoding });

					case 6:
						firstResponse = _context4.sent;
						_context4.next = 9;
						return (0, _2.default)(s.url + endpoint, { cache: cache, encoding: secondEncoding });

					case 9:
						secondResponse = _context4.sent;
						expectedSecondResponseBody = Buffer.from(firstResponse.body, firstEncoding).toString(secondEncoding);


						t.is(cache.size, 1);
						t.is(secondResponse.body, expectedSecondResponseBody);

					case 13:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function (_x3) {
		return _ref4.apply(this, arguments);
	};
}());

(0, _ava2.default)('Redirects are cached and re-used internally', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var endpoint, cache, firstResponse, secondResponse;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						endpoint = '/301';
						cache = new Map();
						_context5.next = 4;
						return (0, _2.default)(s.url + endpoint, { cache: cache });

					case 4:
						firstResponse = _context5.sent;
						_context5.next = 7;
						return (0, _2.default)(s.url + endpoint, { cache: cache });

					case 7:
						secondResponse = _context5.sent;


						t.is(cache.size, 3);
						t.is(firstResponse.body, secondResponse.body);

					case 10:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, undefined);
	}));

	return function (_x4) {
		return _ref5.apply(this, arguments);
	};
}());

(0, _ava2.default)('Cache error throws got.CacheError', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var endpoint, cache, err;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						endpoint = '/no-store';
						cache = {};
						_context6.next = 4;
						return t.throws((0, _2.default)(s.url + endpoint, { cache: cache }));

					case 4:
						err = _context6.sent;

						t.is(err.name, 'CacheError');

					case 6:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, undefined);
	}));

	return function (_x5) {
		return _ref6.apply(this, arguments);
	};
}());

_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
	return regeneratorRuntime.wrap(function _callee7$(_context7) {
		while (1) {
			switch (_context7.prev = _context7.next) {
				case 0:
					_context7.next = 2;
					return s.close();

				case 2:
				case 'end':
					return _context7.stop();
			}
		}
	}, _callee7, undefined);
})));