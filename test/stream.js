'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _toReadableStream = require('to-readable-stream');

var _toReadableStream2 = _interopRequireDefault(_toReadableStream);

var _getStream = require('get-stream');

var _getStream2 = _interopRequireDefault(_getStream);

var _pEvent = require('p-event');

var _pEvent2 = _interopRequireDefault(_pEvent);

var _is = require('@sindresorhus/is');

var _is2 = _interopRequireDefault(_is);

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

					s.on('/post', function (req, res) {
						req.pipe(res);
					});

					s.on('/redirect', function (req, res) {
						res.writeHead(302, {
							location: s.url
						});
						res.end();
					});

					s.on('/error', function (req, res) {
						res.statusCode = 404;
						res.end();
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

(0, _ava2.default)('option.json can not be used', function (t) {
	t.throws(function () {
		_2.default.stream(s.url, { json: true });
	}, 'Got can not be used as a stream when the `json` option is used');
});

(0, _ava2.default)('returns readable stream', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		var data;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return (0, _pEvent2.default)(_2.default.stream(s.url), 'data');

					case 2:
						data = _context2.sent;

						t.is(data.toString(), 'ok');

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

(0, _ava2.default)('returns writeable stream', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var stream, promise;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						stream = _2.default.stream.post(s.url + '/post');
						promise = (0, _pEvent2.default)(stream, 'data');

						stream.end('wow');
						_context3.t0 = t;
						_context3.next = 6;
						return promise;

					case 6:
						_context3.t1 = _context3.sent.toString();

						_context3.t0.is.call(_context3.t0, _context3.t1, 'wow');

					case 8:
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

(0, _ava2.default)('throws on write to stream with body specified', function (t) {
	t.throws(function () {
		_2.default.stream(s.url, { body: 'wow' }).end('wow');
	}, 'Got\'s stream is not writable when the `body` option is used');
});

(0, _ava2.default)('have request event', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var request;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return (0, _pEvent2.default)(_2.default.stream(s.url), 'request');

					case 2:
						request = _context4.sent;

						t.truthy(request);
						t.is(request.method, 'GET');

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

(0, _ava2.default)('have redirect event', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var response;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return (0, _pEvent2.default)(_2.default.stream(s.url + '/redirect'), 'redirect');

					case 2:
						response = _context5.sent;

						t.is(response.headers.location, s.url);

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

(0, _ava2.default)('have response event', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var response;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.next = 2;
						return (0, _pEvent2.default)(_2.default.stream(s.url), 'response');

					case 2:
						response = _context6.sent;

						t.is(response.statusCode, 200);

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

(0, _ava2.default)('have error event', function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		var stream;
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						stream = _2.default.stream(s.url + '/error', { retries: 0 });
						_context7.next = 3;
						return t.throws((0, _pEvent2.default)(stream, 'response'), /Response code 404 \(Not Found\)/);

					case 3:
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

(0, _ava2.default)('have error event #2', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		var stream;
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						stream = _2.default.stream('.com', { retries: 0 });
						_context8.next = 3;
						return t.throws((0, _pEvent2.default)(stream, 'response'), /getaddrinfo ENOTFOUND/);

					case 3:
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

(0, _ava2.default)('have response event on throwHttpErrors === false', function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
		var response;
		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						_context9.next = 2;
						return (0, _pEvent2.default)(_2.default.stream(s.url + '/error', { throwHttpErrors: false }), 'response');

					case 2:
						response = _context9.sent;

						t.is(response.statusCode, 404);

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

(0, _ava2.default)('accepts option.body as Stream', function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
		var stream, data;
		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						stream = _2.default.stream(s.url + '/post', { body: (0, _toReadableStream2.default)('wow') });
						_context10.next = 3;
						return (0, _pEvent2.default)(stream, 'data');

					case 3:
						data = _context10.sent;

						t.is(data.toString(), 'wow');

					case 5:
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

(0, _ava2.default)('redirect response contains old url', function () {
	var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
		var response;
		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						_context11.next = 2;
						return (0, _pEvent2.default)(_2.default.stream(s.url + '/redirect'), 'response');

					case 2:
						response = _context11.sent;

						t.is(response.requestUrl, s.url + '/redirect');

					case 4:
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

(0, _ava2.default)('check for pipe method', function (t) {
	var stream = _2.default.stream(s.url + '/');
	t.true(_is2.default.function(stream.pipe));
	t.true(_is2.default.function(stream.on('error', function () {}).pipe));
});

(0, _ava2.default)('piping works', function () {
	var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
		return regeneratorRuntime.wrap(function _callee12$(_context12) {
			while (1) {
				switch (_context12.prev = _context12.next) {
					case 0:
						_context12.t0 = t;
						_context12.next = 3;
						return (0, _getStream2.default)(_2.default.stream(s.url + '/'));

					case 3:
						_context12.t1 = _context12.sent;

						_context12.t0.is.call(_context12.t0, _context12.t1, 'ok');

						_context12.t2 = t;
						_context12.next = 8;
						return (0, _getStream2.default)(_2.default.stream(s.url + '/').on('error', function () {}));

					case 8:
						_context12.t3 = _context12.sent;

						_context12.t2.is.call(_context12.t2, _context12.t3, 'ok');

					case 10:
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