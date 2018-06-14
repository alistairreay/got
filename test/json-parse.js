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
	return regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return (0, _server.createServer)();

				case 2:
					s = _context.sent;


					s.on('/', function (req, res) {
						res.end('{"data":"dog"}');
					});

					s.on('/invalid', function (req, res) {
						res.end('/');
					});

					s.on('/no-body', function (req, res) {
						res.statusCode = 200;
						res.end();
					});

					s.on('/non200', function (req, res) {
						res.statusCode = 500;
						res.end('{"data":"dog"}');
					});

					s.on('/non200-invalid', function (req, res) {
						res.statusCode = 500;
						res.end('Internal error');
					});

					s.on('/headers', function (req, res) {
						res.end(JSON.stringify(req.headers));
					});

					_context.next = 11;
					return s.listen(s.port);

				case 11:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

(0, _ava2.default)('parses response', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.t0 = t;
						_context2.next = 3;
						return (0, _2.default)(s.url, { json: true });

					case 3:
						_context2.t1 = _context2.sent.body;
						_context2.t2 = { data: 'dog' };

						_context2.t0.deepEqual.call(_context2.t0, _context2.t1, _context2.t2);

					case 6:
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

(0, _ava2.default)('not parses responses without a body', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var _ref4, body;

		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return (0, _2.default)(s.url + '/no-body', { json: true });

					case 2:
						_ref4 = _context3.sent;
						body = _ref4.body;

						t.is(body, '');

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

(0, _ava2.default)('wraps parsing errors', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return t.throws((0, _2.default)(s.url + '/invalid', { json: true }));

					case 2:
						err = _context4.sent;

						t.regex(err.message, /Unexpected token/);
						t.true(err.message.includes(err.hostname), err.message);
						t.is(err.path, '/invalid');

					case 6:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function (_x3) {
		return _ref5.apply(this, arguments);
	};
}());

(0, _ava2.default)('parses non-200 responses', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return t.throws((0, _2.default)(s.url + '/non200', { json: true }));

					case 2:
						err = _context5.sent;

						t.deepEqual(err.response.body, { data: 'dog' });

					case 4:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, undefined);
	}));

	return function (_x4) {
		return _ref6.apply(this, arguments);
	};
}());

(0, _ava2.default)('ignores errors on invalid non-200 responses', function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.next = 2;
						return t.throws((0, _2.default)(s.url + '/non200-invalid', { json: true }));

					case 2:
						err = _context6.sent;

						t.is(err.message, 'Response code 500 (Internal Server Error)');
						t.is(err.response.body, 'Internal error');
						t.is(err.path, '/non200-invalid');

					case 6:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, undefined);
	}));

	return function (_x5) {
		return _ref7.apply(this, arguments);
	};
}());

(0, _ava2.default)('should have statusCode in err', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.next = 2;
						return t.throws((0, _2.default)(s.url + '/invalid', { json: true }));

					case 2:
						err = _context7.sent;

						t.is(err.constructor, _2.default.ParseError);
						t.is(err.statusCode, 200);

					case 5:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, undefined);
	}));

	return function (_x6) {
		return _ref8.apply(this, arguments);
	};
}());

(0, _ava2.default)('should set correct headers', function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		var _ref10, headers;

		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						_context8.next = 2;
						return (0, _2.default)(s.url + '/headers', { json: true, body: {} });

					case 2:
						_ref10 = _context8.sent;
						headers = _ref10.body;

						t.is(headers['content-type'], 'application/json');
						t.is(headers.accept, 'application/json');

					case 6:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, undefined);
	}));

	return function (_x7) {
		return _ref9.apply(this, arguments);
	};
}());

_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
	return regeneratorRuntime.wrap(function _callee9$(_context9) {
		while (1) {
			switch (_context9.prev = _context9.next) {
				case 0:
					_context9.next = 2;
					return s.close();

				case 2:
				case 'end':
					return _context9.stop();
			}
		}
	}, _callee9, undefined);
})));