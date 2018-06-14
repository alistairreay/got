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
						res.end('ok');
					});

					s.on('/404', function (req, res) {
						res.statusCode = 404;
						res.end('not found');
					});

					_context.next = 7;
					return s.listen(s.port);

				case 7:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

(0, _ava2.default)('promise mode', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		var err, err2;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.t0 = t;
						_context2.next = 3;
						return _2.default.get(s.url);

					case 3:
						_context2.t1 = _context2.sent.body;

						_context2.t0.is.call(_context2.t0, _context2.t1, 'ok');

						_context2.next = 7;
						return t.throws(_2.default.get(s.url + '/404'));

					case 7:
						err = _context2.sent;

						t.is(err.response.body, 'not found');

						_context2.next = 11;
						return t.throws(_2.default.get('.com', { retries: 0 }));

					case 11:
						err2 = _context2.sent;

						t.truthy(err2);

					case 13:
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

_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
	return regeneratorRuntime.wrap(function _callee3$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					_context3.next = 2;
					return s.close();

				case 2:
				case 'end':
					return _context3.stop();
			}
		}
	}, _callee3, undefined);
})));