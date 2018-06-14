'use strict';

var _util = require('util');

var _tempy = require('tempy');

var _tempy2 = _interopRequireDefault(_tempy);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _server = require('./helpers/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var socketPath = _tempy2.default.file({ extension: 'socket' });

var s = void 0;

if (process.platform !== 'win32') {
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

						s.on('/foo:bar', function (req, res) {
							res.end('ok');
						});

						_context.next = 7;
						return s.listen(socketPath);

					case 7:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	})));

	(0, _ava2.default)('works', function () {
		var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
			var url;
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							url = (0, _util.format)('http://unix:%s:%s', socketPath, '/');
							_context2.t0 = t;
							_context2.next = 4;
							return (0, _2.default)(url);

						case 4:
							_context2.t1 = _context2.sent.body;

							_context2.t0.is.call(_context2.t0, _context2.t1, 'ok');

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

	(0, _ava2.default)('protocol-less works', function () {
		var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
			var url;
			return regeneratorRuntime.wrap(function _callee3$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							url = (0, _util.format)('unix:%s:%s', socketPath, '/');
							_context3.t0 = t;
							_context3.next = 4;
							return (0, _2.default)(url);

						case 4:
							_context3.t1 = _context3.sent.body;

							_context3.t0.is.call(_context3.t0, _context3.t1, 'ok');

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

	(0, _ava2.default)('address with : works', function () {
		var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
			var url;
			return regeneratorRuntime.wrap(function _callee4$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							url = (0, _util.format)('unix:%s:%s', socketPath, '/foo:bar');
							_context4.t0 = t;
							_context4.next = 4;
							return (0, _2.default)(url);

						case 4:
							_context4.t1 = _context4.sent.body;

							_context4.t0.is.call(_context4.t0, _context4.t1, 'ok');

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

	_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return s.close();

					case 2:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, undefined);
	})));
}