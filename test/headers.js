'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _package = require('../package');

var _package2 = _interopRequireDefault(_package);

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
						req.resume();
						res.end(JSON.stringify(req.headers));
					});

					_context.next = 6;
					return s.listen(s.port);

				case 6:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

(0, _ava2.default)('user-agent', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		var headers;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return (0, _2.default)(s.url, { json: true });

					case 2:
						headers = _context2.sent.body;

						t.is(headers['user-agent'], _package2.default.name + '/' + _package2.default.version + ' (https://github.com/sindresorhus/got)');

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

(0, _ava2.default)('accept-encoding', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var headers;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return (0, _2.default)(s.url, { json: true });

					case 2:
						headers = _context3.sent.body;

						t.is(headers['accept-encoding'], 'gzip, deflate');

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

(0, _ava2.default)('do not override accept-encoding', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var headers;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return (0, _2.default)(s.url, {
							json: true,
							headers: {
								'accept-encoding': 'gzip'
							}
						});

					case 2:
						headers = _context4.sent.body;

						t.is(headers['accept-encoding'], 'gzip');

					case 4:
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

(0, _ava2.default)('do not set accept-encoding header when decompress options is false', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var _ref6, headers;

		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return (0, _2.default)(s.url, {
							json: true,
							decompress: false
						});

					case 2:
						_ref6 = _context5.sent;
						headers = _ref6.body;

						t.false(Reflect.has(headers, 'accept-encoding'));

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

(0, _ava2.default)('accept header with json option', function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var headers;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.next = 2;
						return (0, _2.default)(s.url, { json: true });

					case 2:
						headers = _context6.sent.body;

						t.is(headers.accept, 'application/json');

						_context6.next = 6;
						return (0, _2.default)(s.url, {
							headers: {
								accept: ''
							},
							json: true
						});

					case 6:
						headers = _context6.sent.body;

						t.is(headers.accept, '');

					case 8:
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

(0, _ava2.default)('host', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		var headers;
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.next = 2;
						return (0, _2.default)(s.url, { json: true });

					case 2:
						headers = _context7.sent.body;

						t.is(headers.host, 'localhost:' + s.port);

					case 4:
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

(0, _ava2.default)('transform names to lowercase', function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		var headers;
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						_context8.next = 2;
						return (0, _2.default)(s.url, {
							headers: {
								'USER-AGENT': 'test'
							},
							json: true
						});

					case 2:
						headers = _context8.sent.body;

						t.is(headers['user-agent'], 'test');

					case 4:
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

(0, _ava2.default)('zero content-length', function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
		var _ref11, body, headers;

		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						_context9.next = 2;
						return (0, _2.default)(s.url, {
							headers: {
								'content-length': 0
							},
							body: 'sup'
						});

					case 2:
						_ref11 = _context9.sent;
						body = _ref11.body;
						headers = JSON.parse(body);

						t.is(headers['content-length'], '0');

					case 6:
					case 'end':
						return _context9.stop();
				}
			}
		}, _callee9, undefined);
	}));

	return function (_x8) {
		return _ref10.apply(this, arguments);
	};
}());

(0, _ava2.default)('form-data manual content-type', function () {
	var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
		var form, _ref13, body, headers;

		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						form = new _formData2.default();

						form.append('a', 'b');
						_context10.next = 4;
						return (0, _2.default)(s.url, {
							headers: {
								'content-type': 'custom'
							},
							body: form
						});

					case 4:
						_ref13 = _context10.sent;
						body = _ref13.body;
						headers = JSON.parse(body);

						t.is(headers['content-type'], 'custom');

					case 8:
					case 'end':
						return _context10.stop();
				}
			}
		}, _callee10, undefined);
	}));

	return function (_x9) {
		return _ref12.apply(this, arguments);
	};
}());

(0, _ava2.default)('form-data automatic content-type', function () {
	var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
		var form, _ref15, body, headers;

		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						form = new _formData2.default();

						form.append('a', 'b');
						_context11.next = 4;
						return (0, _2.default)(s.url, {
							body: form
						});

					case 4:
						_ref15 = _context11.sent;
						body = _ref15.body;
						headers = JSON.parse(body);

						t.is(headers['content-type'], 'multipart/form-data; boundary=' + form.getBoundary());

					case 8:
					case 'end':
						return _context11.stop();
				}
			}
		}, _callee11, undefined);
	}));

	return function (_x10) {
		return _ref14.apply(this, arguments);
	};
}());

(0, _ava2.default)('form-data sets content-length', function () {
	var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
		var form, _ref17, body, headers;

		return regeneratorRuntime.wrap(function _callee12$(_context12) {
			while (1) {
				switch (_context12.prev = _context12.next) {
					case 0:
						form = new _formData2.default();

						form.append('a', 'b');
						_context12.next = 4;
						return (0, _2.default)(s.url, { body: form });

					case 4:
						_ref17 = _context12.sent;
						body = _ref17.body;
						headers = JSON.parse(body);

						t.is(headers['content-length'], '157');

					case 8:
					case 'end':
						return _context12.stop();
				}
			}
		}, _callee12, undefined);
	}));

	return function (_x11) {
		return _ref16.apply(this, arguments);
	};
}());

(0, _ava2.default)('stream as options.body sets content-length', function () {
	var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(t) {
		var _ref19, body, headers;

		return regeneratorRuntime.wrap(function _callee13$(_context13) {
			while (1) {
				switch (_context13.prev = _context13.next) {
					case 0:
						_context13.next = 2;
						return (0, _2.default)(s.url, {
							body: _fs2.default.createReadStream(_path2.default.join(__dirname, 'fixtures/stream-content-length'))
						});

					case 2:
						_ref19 = _context13.sent;
						body = _ref19.body;
						headers = JSON.parse(body);

						t.is(headers['content-length'], '9');

					case 6:
					case 'end':
						return _context13.stop();
				}
			}
		}, _callee13, undefined);
	}));

	return function (_x12) {
		return _ref18.apply(this, arguments);
	};
}());

(0, _ava2.default)('remove null value headers', function () {
	var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(t) {
		var _ref21, body, headers;

		return regeneratorRuntime.wrap(function _callee14$(_context14) {
			while (1) {
				switch (_context14.prev = _context14.next) {
					case 0:
						_context14.next = 2;
						return (0, _2.default)(s.url, {
							headers: {
								unicorns: null
							}
						});

					case 2:
						_ref21 = _context14.sent;
						body = _ref21.body;
						headers = JSON.parse(body);

						t.false(Reflect.has(headers, 'unicorns'));

					case 6:
					case 'end':
						return _context14.stop();
				}
			}
		}, _callee14, undefined);
	}));

	return function (_x13) {
		return _ref20.apply(this, arguments);
	};
}());

(0, _ava2.default)('remove undefined value headers', function () {
	var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(t) {
		var _ref23, body, headers;

		return regeneratorRuntime.wrap(function _callee15$(_context15) {
			while (1) {
				switch (_context15.prev = _context15.next) {
					case 0:
						_context15.next = 2;
						return (0, _2.default)(s.url, {
							headers: {
								unicorns: undefined
							}
						});

					case 2:
						_ref23 = _context15.sent;
						body = _ref23.body;
						headers = JSON.parse(body);

						t.false(Reflect.has(headers, 'unicorns'));

					case 6:
					case 'end':
						return _context15.stop();
				}
			}
		}, _callee15, undefined);
	}));

	return function (_x14) {
		return _ref22.apply(this, arguments);
	};
}());

_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
	return regeneratorRuntime.wrap(function _callee16$(_context16) {
		while (1) {
			switch (_context16.prev = _context16.next) {
				case 0:
					_context16.next = 2;
					return s.close();

				case 2:
				case 'end':
					return _context16.stop();
			}
		}
	}, _callee16, undefined);
})));