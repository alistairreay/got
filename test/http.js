'use strict';

var _is = require('@sindresorhus/is');

var _is2 = _interopRequireDefault(_is);

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
						res.end('ok');
					});

					s.on('/empty', function (req, res) {
						res.end();
					});

					s.on('/304', function (req, res) {
						res.statusCode = 304;
						res.end();
					});

					s.on('/404', function (req, res) {
						res.statusCode = 404;
						res.end('not');
					});

					s.on('/?recent=true', function (req, res) {
						res.end('recent');
					});

					_context.next = 10;
					return s.listen(s.port);

				case 10:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

(0, _ava2.default)('simple request', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.t0 = t;
						_context2.next = 3;
						return (0, _2.default)(s.url);

					case 3:
						_context2.t1 = _context2.sent.body;

						_context2.t0.is.call(_context2.t0, _context2.t1, 'ok');

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

(0, _ava2.default)('empty response', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.t0 = t;
						_context3.next = 3;
						return (0, _2.default)(s.url + '/empty');

					case 3:
						_context3.t1 = _context3.sent.body;

						_context3.t0.is.call(_context3.t0, _context3.t1, '');

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

(0, _ava2.default)('requestUrl response', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.t0 = t;
						_context4.next = 3;
						return (0, _2.default)(s.url);

					case 3:
						_context4.t1 = _context4.sent.requestUrl;
						_context4.t2 = s.url + '/';

						_context4.t0.is.call(_context4.t0, _context4.t1, _context4.t2);

						_context4.t3 = t;
						_context4.next = 9;
						return (0, _2.default)(s.url + '/empty');

					case 9:
						_context4.t4 = _context4.sent.requestUrl;
						_context4.t5 = s.url + '/empty';

						_context4.t3.is.call(_context4.t3, _context4.t4, _context4.t5);

					case 12:
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

(0, _ava2.default)('error with code', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return t.throws((0, _2.default)(s.url + '/404'));

					case 2:
						err = _context5.sent;

						t.is(err.statusCode, 404);
						t.is(err.response.body, 'not');

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

(0, _ava2.default)('status code 304 doesn\'t throw', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var p, response;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						p = (0, _2.default)(s.url + '/304');
						_context6.next = 3;
						return t.notThrows(p);

					case 3:
						_context6.next = 5;
						return p;

					case 5:
						response = _context6.sent;

						t.is(response.statusCode, 304);
						t.is(response.body, '');

					case 8:
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

(0, _ava2.default)('doesn\'t throw on throwHttpErrors === false', function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.t0 = t;
						_context7.next = 3;
						return (0, _2.default)(s.url + '/404', { throwHttpErrors: false });

					case 3:
						_context7.t1 = _context7.sent.body;

						_context7.t0.is.call(_context7.t0, _context7.t1, 'not');

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

(0, _ava2.default)('invalid protocol throws', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						_context8.next = 2;
						return t.throws((0, _2.default)('c:/nope.com', { json: true }));

					case 2:
						err = _context8.sent;

						t.is(err.constructor, _2.default.UnsupportedProtocolError);

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

(0, _ava2.default)('buffer on encoding === null', function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
		var data;
		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						_context9.next = 2;
						return (0, _2.default)(s.url, { encoding: null });

					case 2:
						data = _context9.sent.body;

						t.true(_is2.default.buffer(data));

					case 4:
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

(0, _ava2.default)('query option', function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						_context10.t0 = t;
						_context10.next = 3;
						return (0, _2.default)(s.url, { query: { recent: true } });

					case 3:
						_context10.t1 = _context10.sent.body;

						_context10.t0.is.call(_context10.t0, _context10.t1, 'recent');

						_context10.t2 = t;
						_context10.next = 8;
						return (0, _2.default)(s.url, { query: 'recent=true' });

					case 8:
						_context10.t3 = _context10.sent.body;

						_context10.t2.is.call(_context10.t2, _context10.t3, 'recent');

					case 10:
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

(0, _ava2.default)('requestUrl response when sending url as param', function () {
	var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						_context11.t0 = t;
						_context11.next = 3;
						return (0, _2.default)(s.url, { hostname: s.host, port: s.port });

					case 3:
						_context11.t1 = _context11.sent.requestUrl;
						_context11.t2 = s.url + '/';

						_context11.t0.is.call(_context11.t0, _context11.t1, _context11.t2);

						_context11.t3 = t;
						_context11.next = 9;
						return (0, _2.default)({ hostname: s.host, port: s.port });

					case 9:
						_context11.t4 = _context11.sent.requestUrl;
						_context11.t5 = s.url + '/';

						_context11.t3.is.call(_context11.t3, _context11.t4, _context11.t5);

					case 12:
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

(0, _ava2.default)('response contains url', function () {
	var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
		return regeneratorRuntime.wrap(function _callee12$(_context12) {
			while (1) {
				switch (_context12.prev = _context12.next) {
					case 0:
						_context12.t0 = t;
						_context12.next = 3;
						return (0, _2.default)(s.url);

					case 3:
						_context12.t1 = _context12.sent.url;
						_context12.t2 = s.url + '/';

						_context12.t0.is.call(_context12.t0, _context12.t1, _context12.t2);

					case 6:
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

_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
	return regeneratorRuntime.wrap(function _callee13$(_context13) {
		while (1) {
			switch (_context13.prev = _context13.next) {
				case 0:
					_context13.next = 2;
					return s.close();

				case 2:
				case 'end':
					return _context13.stop();
			}
		}
	}, _callee13, undefined);
})));