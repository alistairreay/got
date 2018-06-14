'use strict';

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _pem = require('pem');

var _pem2 = _interopRequireDefault(_pem);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _server = require('./helpers/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var s = void 0;
var caRootCert = void 0;

var createCertificate = _util2.default.promisify(_pem2.default.createCertificate);

_ava2.default.before('setup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	var caKeys, caRootKey, keys, key, cert;
	return regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return createCertificate({
						days: 1,
						selfSigned: true
					});

				case 2:
					caKeys = _context.sent;
					caRootKey = caKeys.serviceKey;

					caRootCert = caKeys.certificate;

					_context.next = 7;
					return createCertificate({
						serviceCertificate: caRootCert,
						serviceKey: caRootKey,
						serial: Date.now(),
						days: 500,
						country: '',
						state: '',
						locality: '',
						organization: '',
						organizationUnit: '',
						commonName: 'sindresorhus.com'
					});

				case 7:
					keys = _context.sent;
					key = keys.clientKey;
					cert = keys.certificate;
					_context.next = 12;
					return (0, _server.createSSLServer)({ key: key, cert: cert });

				case 12:
					s = _context.sent;


					s.on('/', function (req, res) {
						return res.end('ok');
					});

					_context.next = 16;
					return s.listen(s.port);

				case 16:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

(0, _ava2.default)('make request to https server without ca', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.t0 = t;
						_context2.next = 3;
						return (0, _2.default)(s.url, { rejectUnauthorized: false });

					case 3:
						_context2.t1 = _context2.sent.body;

						_context2.t0.truthy.call(_context2.t0, _context2.t1);

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

(0, _ava2.default)('make request to https server with ca', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var _ref4, body;

		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return (0, _2.default)(s.url, {
							ca: caRootCert,
							headers: { host: 'sindresorhus.com' }
						});

					case 2:
						_ref4 = _context3.sent;
						body = _ref4.body;

						t.is(body, 'ok');

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

(0, _ava2.default)('protocol-less URLs default to HTTPS', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var _ref6, body, requestUrl;

		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return (0, _2.default)(s.url.replace(/^https:\/\//, ''), {
							ca: caRootCert,
							headers: { host: 'sindresorhus.com' }
						});

					case 2:
						_ref6 = _context4.sent;
						body = _ref6.body;
						requestUrl = _ref6.requestUrl;

						t.is(body, 'ok');
						t.true(requestUrl.startsWith('https://'));

					case 7:
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