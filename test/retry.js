'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _server = require('./helpers/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var s = void 0;
var trys = 0;
var knocks = 0;
var fifth = 0;

_ava2.default.before('setup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	return regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return (0, _server.createServer)();

				case 2:
					s = _context.sent;


					s.on('/long', function () {});

					s.on('/knock-twice', function (req, res) {
						if (knocks++ === 1) {
							res.end('who`s there?');
						}
					});

					s.on('/try-me', function () {
						trys++;
					});

					s.on('/fifth', function (req, res) {
						if (fifth++ === 5) {
							res.end('who`s there?');
						}
					});

					_context.next = 9;
					return s.listen(s.port);

				case 9:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

(0, _ava2.default)('works on timeout error', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.t0 = t;
						_context2.next = 3;
						return (0, _2.default)(s.url + '/knock-twice', { timeout: { connect: 100, socket: 100 } });

					case 3:
						_context2.t1 = _context2.sent.body;

						_context2.t0.is.call(_context2.t0, _context2.t1, 'who`s there?');

					case 5:
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

(0, _ava2.default)('can be disabled with option', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return t.throws((0, _2.default)(s.url + '/try-me', {
							timeout: { connect: 500, socket: 500 },
							retries: 0
						}));

					case 2:
						err = _context3.sent;

						t.truthy(err);
						t.is(trys, 1);

					case 5:
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

(0, _ava2.default)('function gets iter count', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return (0, _2.default)(s.url + '/fifth', {
							timeout: { connect: 500, socket: 500 },
							retries: function retries(iter) {
								return iter < 10;
							}
						});

					case 2:
						t.is(fifth, 6);

					case 3:
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

(0, _ava2.default)('falsy value prevents retries', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return t.throws((0, _2.default)(s.url + '/long', {
							timeout: { connect: 100, socket: 100 },
							retries: function retries() {
								return 0;
							}
						}));

					case 2:
						err = _context5.sent;

						t.truthy(err);

					case 4:
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

(0, _ava2.default)('falsy value prevents retries #2', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.next = 2;
						return t.throws((0, _2.default)(s.url + '/long', {
							timeout: { connect: 100, socket: 100 },
							retries: function retries(iter, err) {
								t.truthy(err);
								return false;
							}
						}));

					case 2:
						err = _context6.sent;

						t.truthy(err);

					case 4:
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