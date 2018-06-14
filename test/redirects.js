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

var http = void 0;
var https = void 0;

var createCertificate = _util2.default.promisify(_pem2.default.createCertificate);

_ava2.default.before('setup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	var caKeys, caRootKey, caRootCert, keys, key, cert;
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
					https = _context.sent;
					_context.next = 15;
					return (0, _server.createServer)();

				case 15:
					http = _context.sent;


					// HTTPS Handlers

					https.on('/', function (req, res) {
						res.end('https');
					});

					https.on('/httpsToHttp', function (req, res) {
						res.writeHead(302, {
							location: http.url
						});
						res.end();
					});

					// HTTP Handlers

					http.on('/', function (req, res) {
						res.end('reached');
					});

					http.on('/finite', function (req, res) {
						res.writeHead(302, {
							location: http.url + '/'
						});
						res.end();
					});

					http.on('/utf8-url-áé', function (req, res) {
						res.end('reached');
					});

					http.on('/redirect-with-utf8-binary', function (req, res) {
						res.writeHead(302, {
							location: Buffer.from(http.url + '/utf8-url-\xE1\xE9', 'utf8').toString('binary')
						});
						res.end();
					});

					http.on('/endless', function (req, res) {
						res.writeHead(302, {
							location: http.url + '/endless'
						});
						res.end();
					});

					http.on('/relative', function (req, res) {
						res.writeHead(302, {
							location: '/'
						});
						res.end();
					});

					http.on('/seeOther', function (req, res) {
						res.writeHead(303, {
							location: '/'
						});
						res.end();
					});

					http.on('/temporary', function (req, res) {
						res.writeHead(307, {
							location: '/'
						});
						res.end();
					});

					http.on('/permanent', function (req, res) {
						res.writeHead(308, {
							location: '/'
						});
						res.end();
					});

					http.on('/relativeQuery?bang', function (req, res) {
						res.writeHead(302, {
							location: '/'
						});
						res.end();
					});

					http.on('/httpToHttps', function (req, res) {
						res.writeHead(302, {
							location: https.url
						});
						res.end();
					});

					_context.next = 31;
					return http.listen(http.port);

				case 31:
					_context.next = 33;
					return https.listen(https.port);

				case 33:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
	return regeneratorRuntime.wrap(function _callee2$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return http.close();

				case 2:
					_context2.next = 4;
					return https.close();

				case 4:
				case 'end':
					return _context2.stop();
			}
		}
	}, _callee2, undefined);
})));

(0, _ava2.default)('follows redirect', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var _ref4, body, redirectUrls;

		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return (0, _2.default)(http.url + '/finite');

					case 2:
						_ref4 = _context3.sent;
						body = _ref4.body;
						redirectUrls = _ref4.redirectUrls;

						t.is(body, 'reached');
						t.deepEqual(redirectUrls, [http.url + '/']);

					case 7:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function (_x) {
		return _ref3.apply(this, arguments);
	};
}());

(0, _ava2.default)('follows 307, 308 redirect', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var tempBody, permBody;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return (0, _2.default)(http.url + '/temporary');

					case 2:
						tempBody = _context4.sent.body;

						t.is(tempBody, 'reached');

						_context4.next = 6;
						return (0, _2.default)(http.url + '/permanent');

					case 6:
						permBody = _context4.sent.body;

						t.is(permBody, 'reached');

					case 8:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function (_x2) {
		return _ref5.apply(this, arguments);
	};
}());

(0, _ava2.default)('does not follow redirect when disabled', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.t0 = t;
						_context5.next = 3;
						return (0, _2.default)(http.url + '/finite', { followRedirect: false });

					case 3:
						_context5.t1 = _context5.sent.statusCode;

						_context5.t0.is.call(_context5.t0, _context5.t1, 302);

					case 5:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, undefined);
	}));

	return function (_x3) {
		return _ref6.apply(this, arguments);
	};
}());

(0, _ava2.default)('relative redirect works', function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.t0 = t;
						_context6.next = 3;
						return (0, _2.default)(http.url + '/relative');

					case 3:
						_context6.t1 = _context6.sent.body;

						_context6.t0.is.call(_context6.t0, _context6.t1, 'reached');

					case 5:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, undefined);
	}));

	return function (_x4) {
		return _ref7.apply(this, arguments);
	};
}());

(0, _ava2.default)('throws on endless redirect', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.next = 2;
						return t.throws((0, _2.default)(http.url + '/endless'));

					case 2:
						err = _context7.sent;

						t.is(err.message, 'Redirected 10 times. Aborting.');
						t.deepEqual(err.redirectUrls, new Array(10).fill(http.url + '/endless'));

					case 5:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, undefined);
	}));

	return function (_x5) {
		return _ref8.apply(this, arguments);
	};
}());

(0, _ava2.default)('query in options are not breaking redirects', function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						_context8.t0 = t;
						_context8.next = 3;
						return (0, _2.default)(http.url + '/relativeQuery', { query: 'bang' });

					case 3:
						_context8.t1 = _context8.sent.body;

						_context8.t0.is.call(_context8.t0, _context8.t1, 'reached');

					case 5:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, undefined);
	}));

	return function (_x6) {
		return _ref9.apply(this, arguments);
	};
}());

(0, _ava2.default)('hostname+path in options are not breaking redirects', function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						_context9.t0 = t;
						_context9.next = 3;
						return (0, _2.default)(http.url + '/relative', {
							hostname: http.host,
							path: '/relative'
						});

					case 3:
						_context9.t1 = _context9.sent.body;

						_context9.t0.is.call(_context9.t0, _context9.t1, 'reached');

					case 5:
					case 'end':
						return _context9.stop();
				}
			}
		}, _callee9, undefined);
	}));

	return function (_x7) {
		return _ref10.apply(this, arguments);
	};
}());

(0, _ava2.default)('redirect only GET and HEAD requests', function () {
	var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
		var err;
		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						_context10.next = 2;
						return t.throws((0, _2.default)(http.url + '/relative', { body: 'wow' }));

					case 2:
						err = _context10.sent;

						t.is(err.message, 'Response code 302 (Found)');
						t.is(err.path, '/relative');
						t.is(err.statusCode, 302);

					case 6:
					case 'end':
						return _context10.stop();
				}
			}
		}, _callee10, undefined);
	}));

	return function (_x8) {
		return _ref11.apply(this, arguments);
	};
}());

(0, _ava2.default)('redirect on 303 response even with post, put, delete', function () {
	var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
		var _ref13, url, body;

		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						_context11.next = 2;
						return (0, _2.default)(http.url + '/seeOther', { body: 'wow' });

					case 2:
						_ref13 = _context11.sent;
						url = _ref13.url;
						body = _ref13.body;

						t.is(url, http.url + '/');
						t.is(body, 'reached');

					case 7:
					case 'end':
						return _context11.stop();
				}
			}
		}, _callee11, undefined);
	}));

	return function (_x9) {
		return _ref12.apply(this, arguments);
	};
}());

(0, _ava2.default)('redirects from http to https works', function () {
	var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
		return regeneratorRuntime.wrap(function _callee12$(_context12) {
			while (1) {
				switch (_context12.prev = _context12.next) {
					case 0:
						_context12.t0 = t;
						_context12.next = 3;
						return (0, _2.default)(http.url + '/httpToHttps', { rejectUnauthorized: false });

					case 3:
						_context12.t1 = _context12.sent.body;

						_context12.t0.truthy.call(_context12.t0, _context12.t1);

					case 5:
					case 'end':
						return _context12.stop();
				}
			}
		}, _callee12, undefined);
	}));

	return function (_x10) {
		return _ref14.apply(this, arguments);
	};
}());

(0, _ava2.default)('redirects from https to http works', function () {
	var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(t) {
		return regeneratorRuntime.wrap(function _callee13$(_context13) {
			while (1) {
				switch (_context13.prev = _context13.next) {
					case 0:
						_context13.t0 = t;
						_context13.next = 3;
						return (0, _2.default)(https.url + '/httpsToHttp', { rejectUnauthorized: false });

					case 3:
						_context13.t1 = _context13.sent.body;

						_context13.t0.truthy.call(_context13.t0, _context13.t1);

					case 5:
					case 'end':
						return _context13.stop();
				}
			}
		}, _callee13, undefined);
	}));

	return function (_x11) {
		return _ref15.apply(this, arguments);
	};
}());

(0, _ava2.default)('redirects works with lowercase method', function () {
	var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(t) {
		var _ref17, body;

		return regeneratorRuntime.wrap(function _callee14$(_context14) {
			while (1) {
				switch (_context14.prev = _context14.next) {
					case 0:
						_context14.next = 2;
						return (0, _2.default)(http.url + '/relative', { method: 'head' });

					case 2:
						_ref17 = _context14.sent;
						body = _ref17.body;

						t.is(body, '');

					case 5:
					case 'end':
						return _context14.stop();
				}
			}
		}, _callee14, undefined);
	}));

	return function (_x12) {
		return _ref16.apply(this, arguments);
	};
}());

(0, _ava2.default)('redirect response contains new url', function () {
	var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(t) {
		var _ref19, url;

		return regeneratorRuntime.wrap(function _callee15$(_context15) {
			while (1) {
				switch (_context15.prev = _context15.next) {
					case 0:
						_context15.next = 2;
						return (0, _2.default)(http.url + '/finite');

					case 2:
						_ref19 = _context15.sent;
						url = _ref19.url;

						t.is(url, http.url + '/');

					case 5:
					case 'end':
						return _context15.stop();
				}
			}
		}, _callee15, undefined);
	}));

	return function (_x13) {
		return _ref18.apply(this, arguments);
	};
}());

(0, _ava2.default)('redirect response contains old url', function () {
	var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(t) {
		var _ref21, requestUrl;

		return regeneratorRuntime.wrap(function _callee16$(_context16) {
			while (1) {
				switch (_context16.prev = _context16.next) {
					case 0:
						_context16.next = 2;
						return (0, _2.default)(http.url + '/finite');

					case 2:
						_ref21 = _context16.sent;
						requestUrl = _ref21.requestUrl;

						t.is(requestUrl, http.url + '/finite');

					case 5:
					case 'end':
						return _context16.stop();
				}
			}
		}, _callee16, undefined);
	}));

	return function (_x14) {
		return _ref20.apply(this, arguments);
	};
}());

(0, _ava2.default)('redirect response contains utf8 with binary encoding', function () {
	var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(t) {
		return regeneratorRuntime.wrap(function _callee17$(_context17) {
			while (1) {
				switch (_context17.prev = _context17.next) {
					case 0:
						_context17.t0 = t;
						_context17.next = 3;
						return (0, _2.default)(http.url + '/redirect-with-utf8-binary');

					case 3:
						_context17.t1 = _context17.sent.body;

						_context17.t0.is.call(_context17.t0, _context17.t1, 'reached');

					case 5:
					case 'end':
						return _context17.stop();
				}
			}
		}, _callee17, undefined);
	}));

	return function (_x15) {
		return _ref22.apply(this, arguments);
	};
}());