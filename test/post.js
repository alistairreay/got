'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _toReadableStream = require('to-readable-stream');

var _toReadableStream2 = _interopRequireDefault(_toReadableStream);

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
						res.setHeader('method', req.method);
						req.pipe(res);
					});

					s.on('/headers', function (req, res) {
						res.end(JSON.stringify(req.headers));
					});

					s.on('/empty', function (req, res) {
						res.end();
					});

					_context.next = 8;
					return s.listen(s.port);

				case 8:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

(0, _ava2.default)('GET can have body', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		var _ref3, body, headers;

		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return _2.default.get(s.url, { body: 'hi' });

					case 2:
						_ref3 = _context2.sent;
						body = _ref3.body;
						headers = _ref3.headers;

						t.is(body, 'hi');
						t.is(headers.method, 'GET');

					case 7:
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

(0, _ava2.default)('sends strings', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var _ref5, body;

		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return (0, _2.default)(s.url, { body: 'wow' });

					case 2:
						_ref5 = _context3.sent;
						body = _ref5.body;

						t.is(body, 'wow');

					case 5:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function (_x2) {
		return _ref4.apply(this, arguments);
	};
}());

(0, _ava2.default)('sends Buffers', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var _ref7, body;

		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return (0, _2.default)(s.url, { body: Buffer.from('wow') });

					case 2:
						_ref7 = _context4.sent;
						body = _ref7.body;

						t.is(body, 'wow');

					case 5:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function (_x3) {
		return _ref6.apply(this, arguments);
	};
}());

(0, _ava2.default)('sends Streams', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var _ref9, body;

		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return (0, _2.default)(s.url, { body: (0, _toReadableStream2.default)('wow') });

					case 2:
						_ref9 = _context5.sent;
						body = _ref9.body;

						t.is(body, 'wow');

					case 5:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, undefined);
	}));

	return function (_x4) {
		return _ref8.apply(this, arguments);
	};
}());

(0, _ava2.default)('sends plain objects as forms', function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var _ref11, body;

		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.next = 2;
						return (0, _2.default)(s.url, {
							body: { such: 'wow' },
							form: true
						});

					case 2:
						_ref11 = _context6.sent;
						body = _ref11.body;

						t.is(body, 'such=wow');

					case 5:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, undefined);
	}));

	return function (_x5) {
		return _ref10.apply(this, arguments);
	};
}());

(0, _ava2.default)('sends arrays as forms', function () {
	var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		var _ref13, body;

		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.next = 2;
						return (0, _2.default)(s.url, {
							body: ['such', 'wow'],
							form: true
						});

					case 2:
						_ref13 = _context7.sent;
						body = _ref13.body;

						t.is(body, '0=such&1=wow');

					case 5:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, undefined);
	}));

	return function (_x6) {
		return _ref12.apply(this, arguments);
	};
}());

(0, _ava2.default)('sends plain objects as JSON', function () {
	var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		var _ref15, body;

		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						_context8.next = 2;
						return (0, _2.default)(s.url, {
							body: { such: 'wow' },
							json: true
						});

					case 2:
						_ref15 = _context8.sent;
						body = _ref15.body;

						t.deepEqual(body, { such: 'wow' });

					case 5:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, undefined);
	}));

	return function (_x7) {
		return _ref14.apply(this, arguments);
	};
}());

(0, _ava2.default)('sends arrays as JSON', function () {
	var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
		var _ref17, body;

		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						_context9.next = 2;
						return (0, _2.default)(s.url, {
							body: ['such', 'wow'],
							json: true
						});

					case 2:
						_ref17 = _context9.sent;
						body = _ref17.body;

						t.deepEqual(body, ['such', 'wow']);

					case 5:
					case 'end':
						return _context9.stop();
				}
			}
		}, _callee9, undefined);
	}));

	return function (_x8) {
		return _ref16.apply(this, arguments);
	};
}());

(0, _ava2.default)('works with empty post response', function () {
	var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
		var _ref19, body;

		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						_context10.next = 2;
						return (0, _2.default)(s.url + '/empty', { body: 'wow' });

					case 2:
						_ref19 = _context10.sent;
						body = _ref19.body;

						t.is(body, '');

					case 5:
					case 'end':
						return _context10.stop();
				}
			}
		}, _callee10, undefined);
	}));

	return function (_x9) {
		return _ref18.apply(this, arguments);
	};
}());

(0, _ava2.default)('content-length header with string body', function () {
	var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
		var _ref21, body, headers;

		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						_context11.next = 2;
						return (0, _2.default)(s.url + '/headers', { body: 'wow' });

					case 2:
						_ref21 = _context11.sent;
						body = _ref21.body;
						headers = JSON.parse(body);

						t.is(headers['content-length'], '3');

					case 6:
					case 'end':
						return _context11.stop();
				}
			}
		}, _callee11, undefined);
	}));

	return function (_x10) {
		return _ref20.apply(this, arguments);
	};
}());

(0, _ava2.default)('content-length header with Buffer body', function () {
	var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
		var _ref23, body, headers;

		return regeneratorRuntime.wrap(function _callee12$(_context12) {
			while (1) {
				switch (_context12.prev = _context12.next) {
					case 0:
						_context12.next = 2;
						return (0, _2.default)(s.url + '/headers', { body: Buffer.from('wow') });

					case 2:
						_ref23 = _context12.sent;
						body = _ref23.body;
						headers = JSON.parse(body);

						t.is(headers['content-length'], '3');

					case 6:
					case 'end':
						return _context12.stop();
				}
			}
		}, _callee12, undefined);
	}));

	return function (_x11) {
		return _ref22.apply(this, arguments);
	};
}());

(0, _ava2.default)('content-length header with Stream body', function () {
	var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(t) {
		var _ref25, body, headers;

		return regeneratorRuntime.wrap(function _callee13$(_context13) {
			while (1) {
				switch (_context13.prev = _context13.next) {
					case 0:
						_context13.next = 2;
						return (0, _2.default)(s.url + '/headers', { body: (0, _toReadableStream2.default)('wow') });

					case 2:
						_ref25 = _context13.sent;
						body = _ref25.body;
						headers = JSON.parse(body);

						t.is(headers['transfer-encoding'], 'chunked', 'likely failed to get headers at all');
						t.is(headers['content-length'], undefined);

					case 7:
					case 'end':
						return _context13.stop();
				}
			}
		}, _callee13, undefined);
	}));

	return function (_x12) {
		return _ref24.apply(this, arguments);
	};
}());

(0, _ava2.default)('content-length header is not overriden', function () {
	var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(t) {
		var _ref27, body, headers;

		return regeneratorRuntime.wrap(function _callee14$(_context14) {
			while (1) {
				switch (_context14.prev = _context14.next) {
					case 0:
						_context14.next = 2;
						return (0, _2.default)(s.url + '/headers', {
							body: 'wow',
							headers: {
								'content-length': '10'
							}
						});

					case 2:
						_ref27 = _context14.sent;
						body = _ref27.body;
						headers = JSON.parse(body);

						t.is(headers['content-length'], '10');

					case 6:
					case 'end':
						return _context14.stop();
				}
			}
		}, _callee14, undefined);
	}));

	return function (_x13) {
		return _ref26.apply(this, arguments);
	};
}());

(0, _ava2.default)('content-length header disabled for chunked transfer-encoding', function () {
	var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(t) {
		var _ref29, body, headers;

		return regeneratorRuntime.wrap(function _callee15$(_context15) {
			while (1) {
				switch (_context15.prev = _context15.next) {
					case 0:
						_context15.next = 2;
						return (0, _2.default)(s.url + '/headers', {
							body: '3\r\nwow\r\n0\r\n',
							headers: {
								'transfer-encoding': 'chunked'
							}
						});

					case 2:
						_ref29 = _context15.sent;
						body = _ref29.body;
						headers = JSON.parse(body);

						t.is(headers['transfer-encoding'], 'chunked', 'likely failed to get headers at all');
						t.is(headers['content-length'], undefined);

					case 7:
					case 'end':
						return _context15.stop();
				}
			}
		}, _callee15, undefined);
	}));

	return function (_x14) {
		return _ref28.apply(this, arguments);
	};
}());

(0, _ava2.default)('content-type header is not overriden when object in options.body', function () {
	var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(t) {
		var _ref31, headers;

		return regeneratorRuntime.wrap(function _callee16$(_context16) {
			while (1) {
				switch (_context16.prev = _context16.next) {
					case 0:
						_context16.next = 2;
						return (0, _2.default)(s.url + '/headers', {
							headers: {
								'content-type': 'doge'
							},
							body: {
								such: 'wow'
							},
							json: true
						});

					case 2:
						_ref31 = _context16.sent;
						headers = _ref31.body;

						t.is(headers['content-type'], 'doge');

					case 5:
					case 'end':
						return _context16.stop();
				}
			}
		}, _callee16, undefined);
	}));

	return function (_x15) {
		return _ref30.apply(this, arguments);
	};
}());

(0, _ava2.default)('throws when json body is not a plain object or array', function () {
	var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(t) {
		return regeneratorRuntime.wrap(function _callee17$(_context17) {
			while (1) {
				switch (_context17.prev = _context17.next) {
					case 0:
						_context17.next = 2;
						return t.throws((0, _2.default)('' + s.url, { body: '{}', json: true }), TypeError);

					case 2:
					case 'end':
						return _context17.stop();
				}
			}
		}, _callee17, undefined);
	}));

	return function (_x16) {
		return _ref32.apply(this, arguments);
	};
}());

(0, _ava2.default)('throws when form body is not a plain object or array', function () {
	var _ref33 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(t) {
		return regeneratorRuntime.wrap(function _callee18$(_context18) {
			while (1) {
				switch (_context18.prev = _context18.next) {
					case 0:
						_context18.next = 2;
						return t.throws((0, _2.default)('' + s.url, { body: 'such=wow', form: true }), TypeError);

					case 2:
					case 'end':
						return _context18.stop();
				}
			}
		}, _callee18, undefined);
	}));

	return function (_x17) {
		return _ref33.apply(this, arguments);
	};
}());

_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
	return regeneratorRuntime.wrap(function _callee19$(_context19) {
		while (1) {
			switch (_context19.prev = _context19.next) {
				case 0:
					_context19.next = 2;
					return s.close();

				case 2:
				case 'end':
					return _context19.stop();
			}
		}
	}, _callee19, undefined);
})));