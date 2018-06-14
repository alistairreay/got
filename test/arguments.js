'use strict';

var _url = require('url');

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _pEvent = require('p-event');

var _pEvent2 = _interopRequireDefault(_pEvent);

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
						res.statusCode = 404;
						res.end();
					});

					s.on('/test', function (req, res) {
						res.end(req.url);
					});

					s.on('/?test=wow', function (req, res) {
						res.end(req.url);
					});

					s.on('/stream', function (req, res) {
						res.end('ok');
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

(0, _ava2.default)('url is required', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return t.throws((0, _2.default)());

					case 2:
						err = _context2.sent;

						t.regex(err.message, /Parameter `url` must be a string or object, not undefined/);

					case 4:
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

(0, _ava2.default)('url should be utf-8 encoded', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return t.throws((0, _2.default)(s.url + '/%D2%E0%EB%EB%E8%ED'));

					case 2:
						err = _context3.sent;

						t.regex(err.message, /Parameter `url` must contain valid UTF-8 character sequences/);

					case 4:
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

(0, _ava2.default)('options are optional', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.t0 = t;
						_context4.next = 3;
						return (0, _2.default)(s.url + '/test');

					case 3:
						_context4.t1 = _context4.sent.body;

						_context4.t0.is.call(_context4.t0, _context4.t1, '/test');

					case 5:
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

(0, _ava2.default)('accepts url.parse object as first argument', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.t0 = t;
						_context5.next = 3;
						return (0, _2.default)({
							hostname: s.host,
							port: s.port,
							path: '/test'
						});

					case 3:
						_context5.t1 = _context5.sent.body;

						_context5.t0.is.call(_context5.t0, _context5.t1, '/test');

					case 5:
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

(0, _ava2.default)('requestUrl with url.parse object as first argument', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.t0 = t;
						_context6.next = 3;
						return (0, _2.default)({
							hostname: s.host,
							port: s.port,
							path: '/test'
						});

					case 3:
						_context6.t1 = _context6.sent.requestUrl;
						_context6.t2 = s.url + '/test';

						_context6.t0.is.call(_context6.t0, _context6.t1, _context6.t2);

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

(0, _ava2.default)('overrides querystring from opts', function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.t0 = t;
						_context7.next = 3;
						return (0, _2.default)(s.url + '/?test=doge', { query: { test: 'wow' } });

					case 3:
						_context7.t1 = _context7.sent.body;

						_context7.t0.is.call(_context7.t0, _context7.t1, '/?test=wow');

					case 5:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, undefined);
	}));

	return function (_x6) {
		return _ref7.apply(this, arguments);
	};
}());

(0, _ava2.default)('should throw with auth in url string', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						_context8.next = 2;
						return t.throws((0, _2.default)('https://test:45d3ps453@account.myservice.com/api/token'));

					case 2:
						err = _context8.sent;

						t.regex(err.message, /Basic authentication must be done with the `auth` option/);

					case 4:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, undefined);
	}));

	return function (_x7) {
		return _ref8.apply(this, arguments);
	};
}());

(0, _ava2.default)('does not throw with auth in url object', function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						_context9.next = 2;
						return t.notThrows((0, _2.default)({
							auth: 'foo:bar',
							hostname: s.host,
							port: s.port,
							path: '/test'
						}));

					case 2:
					case 'end':
						return _context9.stop();
				}
			}
		}, _callee9, undefined);
	}));

	return function (_x8) {
		return _ref9.apply(this, arguments);
	};
}());

(0, _ava2.default)('should throw when body is set to object', function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						_context10.next = 2;
						return t.throws((0, _2.default)(s.url + '/', { body: {} }), TypeError);

					case 2:
					case 'end':
						return _context10.stop();
				}
			}
		}, _callee10, undefined);
	}));

	return function (_x9) {
		return _ref10.apply(this, arguments);
	};
}());

(0, _ava2.default)('WHATWG URL support', function () {
	var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
		var wURL;
		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						wURL = new _url.URL(s.url + '/test');
						_context11.next = 3;
						return t.notThrows((0, _2.default)(wURL));

					case 3:
					case 'end':
						return _context11.stop();
				}
			}
		}, _callee11, undefined);
	}));

	return function (_x10) {
		return _ref11.apply(this, arguments);
	};
}());

(0, _ava2.default)('should return streams when using stream option', function () {
	var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
		var data;
		return regeneratorRuntime.wrap(function _callee12$(_context12) {
			while (1) {
				switch (_context12.prev = _context12.next) {
					case 0:
						_context12.next = 2;
						return (0, _pEvent2.default)((0, _2.default)(s.url + '/stream', { stream: true }), 'data');

					case 2:
						data = _context12.sent;

						t.is(data.toString(), 'ok');

					case 4:
					case 'end':
						return _context12.stop();
				}
			}
		}, _callee12, undefined);
	}));

	return function (_x11) {
		return _ref12.apply(this, arguments);
	};
}());

(0, _ava2.default)('should not allow stream and JSON option at the same time', function () {
	var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(t) {
		var error;
		return regeneratorRuntime.wrap(function _callee13$(_context13) {
			while (1) {
				switch (_context13.prev = _context13.next) {
					case 0:
						_context13.next = 2;
						return t.throws((0, _2.default)(s.url + '/stream', { stream: true, json: true }));

					case 2:
						error = _context13.sent;

						t.is(error.message, 'Got can not be used as a stream when the `json` option is used');

					case 4:
					case 'end':
						return _context13.stop();
				}
			}
		}, _callee13, undefined);
	}));

	return function (_x12) {
		return _ref13.apply(this, arguments);
	};
}());

_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
	return regeneratorRuntime.wrap(function _callee14$(_context14) {
		while (1) {
			switch (_context14.prev = _context14.next) {
				case 0:
					_context14.next = 2;
					return s.close();

				case 2:
				case 'end':
					return _context14.stop();
			}
		}
	}, _callee14, undefined);
})));