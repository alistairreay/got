'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

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
						res.end('not');
					});

					s.on('/default-status-message', function (req, res) {
						res.statusCode = 400;
						res.end('body');
					});

					s.on('/custom-status-message', function (req, res) {
						res.statusCode = 400;
						res.statusMessage = 'Something Exploded';
						res.end('body');
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

(0, _ava2.default)('properties', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return t.throws((0, _2.default)(s.url));

					case 2:
						err = _context2.sent;

						t.truthy(err);
						t.truthy(err.response);
						t.false({}.propertyIsEnumerable.call(err, 'response'));
						t.false({}.hasOwnProperty.call(err, 'code'));
						t.is(err.message, 'Response code 404 (Not Found)');
						t.is(err.host, s.host + ':' + s.port);
						t.is(err.method, 'GET');
						t.is(err.protocol, 'http:');
						t.is(err.url, err.response.requestUrl);
						t.is(err.headers.connection, 'close');
						t.is(err.response.body, 'not');

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

(0, _ava2.default)('dns message', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return t.throws((0, _2.default)('.com', { retries: 0 }));

					case 2:
						err = _context3.sent;

						t.truthy(err);
						t.regex(err.message, /getaddrinfo ENOTFOUND/);
						t.is(err.host, '.com');
						t.is(err.method, 'GET');

					case 7:
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

(0, _ava2.default)('options.body error message', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return t.throws((0, _2.default)(s.url, { body: function body() {} }));

					case 2:
						err = _context4.sent;

						t.regex(err.message, /The `body` option must be a stream\.Readable, string, Buffer or plain Object/);

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

(0, _ava2.default)('default status message', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return t.throws((0, _2.default)(s.url + '/default-status-message'));

					case 2:
						err = _context5.sent;

						t.is(err.statusCode, 400);
						t.is(err.statusMessage, 'Bad Request');

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

(0, _ava2.default)('custom status message', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.next = 2;
						return t.throws((0, _2.default)(s.url + '/custom-status-message'));

					case 2:
						err = _context6.sent;

						t.is(err.statusCode, 400);
						t.is(err.statusMessage, 'Something Exploded');

					case 5:
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

_ava2.default.serial('http.request error', function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		var stub, err;
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						stub = _sinon2.default.stub(_http2.default, 'request').callsFake(function () {
							throw new TypeError('The header content contains invalid characters');
						});
						_context7.next = 3;
						return t.throws((0, _2.default)(s.url));

					case 3:
						err = _context7.sent;

						t.true(err instanceof _2.default.RequestError);
						t.is(err.message, 'The header content contains invalid characters');
						stub.restore();

					case 7:
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

_ava2.default.serial('catch error in mimicResponse', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		var proxiedGot, err;
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						proxiedGot = (0, _proxyquire2.default)('..', {
							'mimic-response': function mimicResponse() {
								throw new Error('Error in mimic-response');
							}
						});
						_context8.next = 3;
						return t.throws(proxiedGot(s.url));

					case 3:
						err = _context8.sent;

						t.is(err.message, 'Error in mimic-response');

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