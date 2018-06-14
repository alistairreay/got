'use strict';

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _getStream = require('get-stream');

var _getStream2 = _interopRequireDefault(_getStream);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _server = require('./helpers/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var testContent = 'Compressible response content.\n';
var testContentUncompressed = 'Uncompressed response content.\n';

var s = void 0;
var gzipData = void 0;

_ava2.default.before('setup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	return regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return (0, _server.createServer)();

				case 2:
					s = _context.sent;
					_context.next = 5;
					return _util2.default.promisify(_zlib2.default.gzip)(testContent);

				case 5:
					gzipData = _context.sent;


					s.on('/', function (req, res) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'text/plain');
						res.setHeader('Content-Encoding', 'gzip');

						if (req.method === 'HEAD') {
							res.end();
							return;
						}

						res.end(gzipData);
					});

					s.on('/corrupted', function (req, res) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'text/plain');
						res.setHeader('Content-Encoding', 'gzip');
						res.end('Not gzipped content');
					});

					s.on('/missing-data', function (req, res) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'text/plain');
						res.setHeader('Content-Encoding', 'gzip');
						res.end(gzipData.slice(0, -1));
					});

					s.on('/uncompressed', function (req, res) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'text/plain');
						res.end(testContentUncompressed);
					});

					_context.next = 12;
					return s.listen(s.port);

				case 12:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

(0, _ava2.default)('decompress content', function () {
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
						_context2.t2 = testContent;

						_context2.t0.is.call(_context2.t0, _context2.t1, _context2.t2);

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

(0, _ava2.default)('decompress content - stream', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.t0 = t;
						_context3.next = 3;
						return (0, _getStream2.default)(_2.default.stream(s.url));

					case 3:
						_context3.t1 = _context3.sent;
						_context3.t2 = testContent;

						_context3.t0.is.call(_context3.t0, _context3.t1, _context3.t2);

					case 6:
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

(0, _ava2.default)('handles gzip error', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return t.throws((0, _2.default)(s.url + '/corrupted'));

					case 2:
						err = _context4.sent;

						t.is(err.message, 'incorrect header check');
						t.is(err.path, '/corrupted');
						t.is(err.name, 'ReadError');

					case 6:
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

(0, _ava2.default)('handles gzip error - stream', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return t.throws((0, _getStream2.default)(_2.default.stream(s.url + '/corrupted')));

					case 2:
						err = _context5.sent;

						t.is(err.message, 'incorrect header check');
						t.is(err.path, '/corrupted');
						t.is(err.name, 'ReadError');

					case 6:
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

(0, _ava2.default)('decompress option opts out of decompressing', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var response;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.next = 2;
						return (0, _2.default)(s.url, { decompress: false });

					case 2:
						response = _context6.sent;

						t.true(Buffer.compare(response.body, gzipData) === 0);

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

(0, _ava2.default)('decompress option doesn\'t alter encoding of uncompressed responses', function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		var response;
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.next = 2;
						return (0, _2.default)(s.url + '/uncompressed', { decompress: false });

					case 2:
						response = _context7.sent;

						t.is(response.body, testContentUncompressed);

					case 4:
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

(0, _ava2.default)('preserve headers property', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						_context8.t0 = t;
						_context8.next = 3;
						return (0, _2.default)(s.url);

					case 3:
						_context8.t1 = _context8.sent.headers;

						_context8.t0.truthy.call(_context8.t0, _context8.t1);

					case 5:
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

(0, _ava2.default)('do not break HEAD responses', function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						_context9.t0 = t;
						_context9.next = 3;
						return _2.default.head(s.url);

					case 3:
						_context9.t1 = _context9.sent.body;

						_context9.t0.is.call(_context9.t0, _context9.t1, '');

					case 5:
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

(0, _ava2.default)('ignore missing data', function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						_context10.t0 = t;
						_context10.next = 3;
						return (0, _2.default)(s.url + '/missing-data');

					case 3:
						_context10.t1 = _context10.sent.body;
						_context10.t2 = testContent;

						_context10.t0.is.call(_context10.t0, _context10.t1, _context10.t2);

					case 6:
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

(0, _ava2.default)('has url and requestUrl properties', function () {
	var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
		var res;
		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						_context11.next = 2;
						return (0, _2.default)(s.url);

					case 2:
						res = _context11.sent;

						t.truthy(res.url);
						t.truthy(res.requestUrl);

					case 5:
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

_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
	return regeneratorRuntime.wrap(function _callee12$(_context12) {
		while (1) {
			switch (_context12.prev = _context12.next) {
				case 0:
					_context12.next = 2;
					return s.close();

				case 2:
				case 'end':
					return _context12.stop();
			}
		}
	}, _callee12, undefined);
})));