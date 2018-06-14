'use strict';

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _http = require('http');

var _https = require('https');

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _pem = require('pem');

var _pem2 = _interopRequireDefault(_pem);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

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
						res.end('http');
					});

					http.on('/httpToHttps', function (req, res) {
						res.writeHead(302, {
							location: https.url
						});
						res.end();
					});

					_context.next = 22;
					return http.listen(http.port);

				case 22:
					_context.next = 24;
					return https.listen(https.port);

				case 24:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
})));

var createAgentSpy = function createAgentSpy(Cls) {
	var agent = new Cls({ keepAlive: true });
	var spy = _sinon2.default.spy(agent, 'addRequest');
	return { agent: agent, spy: spy };
};

(0, _ava2.default)('non-object agent option works with http', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		var _createAgentSpy, agent, spy;

		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_createAgentSpy = createAgentSpy(_http.Agent), agent = _createAgentSpy.agent, spy = _createAgentSpy.spy;
						_context2.t0 = t;
						_context2.next = 4;
						return (0, _2.default)(http.url + '/', {
							rejectUnauthorized: false,
							agent: agent
						});

					case 4:
						_context2.t1 = _context2.sent.body;

						_context2.t0.truthy.call(_context2.t0, _context2.t1);

						t.true(spy.calledOnce);

						// Make sure to close all open sockets
						agent.destroy();

					case 8:
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

(0, _ava2.default)('non-object agent option works with https', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var _createAgentSpy2, agent, spy;

		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_createAgentSpy2 = createAgentSpy(_https.Agent), agent = _createAgentSpy2.agent, spy = _createAgentSpy2.spy;
						_context3.t0 = t;
						_context3.next = 4;
						return (0, _2.default)(https.url + '/', {
							rejectUnauthorized: false,
							agent: agent
						});

					case 4:
						_context3.t1 = _context3.sent.body;

						_context3.t0.truthy.call(_context3.t0, _context3.t1);

						t.true(spy.calledOnce);

						// Make sure to close all open sockets
						agent.destroy();

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

(0, _ava2.default)('redirects from http to https work with an agent object', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var _createAgentSpy3, httpAgent, httpSpy, _createAgentSpy4, httpsAgent, httpsSpy;

		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_createAgentSpy3 = createAgentSpy(_http.Agent), httpAgent = _createAgentSpy3.agent, httpSpy = _createAgentSpy3.spy;
						_createAgentSpy4 = createAgentSpy(_https.Agent), httpsAgent = _createAgentSpy4.agent, httpsSpy = _createAgentSpy4.spy;
						_context4.t0 = t;
						_context4.next = 5;
						return (0, _2.default)(http.url + '/httpToHttps', {
							rejectUnauthorized: false,
							agent: {
								http: httpAgent,
								https: httpsAgent
							}
						});

					case 5:
						_context4.t1 = _context4.sent.body;

						_context4.t0.truthy.call(_context4.t0, _context4.t1);

						t.true(httpSpy.calledOnce);
						t.true(httpsSpy.calledOnce);

						// Make sure to close all open sockets
						httpAgent.destroy();
						httpsAgent.destroy();

					case 11:
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

(0, _ava2.default)('redirects from https to http work with an agent object', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var _createAgentSpy5, httpAgent, httpSpy, _createAgentSpy6, httpsAgent, httpsSpy;

		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_createAgentSpy5 = createAgentSpy(_http.Agent), httpAgent = _createAgentSpy5.agent, httpSpy = _createAgentSpy5.spy;
						_createAgentSpy6 = createAgentSpy(_https.Agent), httpsAgent = _createAgentSpy6.agent, httpsSpy = _createAgentSpy6.spy;
						_context5.t0 = t;
						_context5.next = 5;
						return (0, _2.default)(https.url + '/httpsToHttp', {
							rejectUnauthorized: false,
							agent: {
								http: httpAgent,
								https: httpsAgent
							}
						});

					case 5:
						_context5.t1 = _context5.sent.body;

						_context5.t0.truthy.call(_context5.t0, _context5.t1);

						t.true(httpSpy.calledOnce);
						t.true(httpsSpy.calledOnce);

						// Make sure to close all open sockets
						httpAgent.destroy();
						httpsAgent.destroy();

					case 11:
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

(0, _ava2.default)('socket connect listener cleaned up after request', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var _createAgentSpy7, agent, i, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, value, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, sock;

		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_createAgentSpy7 = createAgentSpy(_https.Agent), agent = _createAgentSpy7.agent;

						// Make sure there are no memory leaks when reusing keep-alive sockets

						i = 0;

					case 2:
						if (!(i < 20)) {
							_context6.next = 8;
							break;
						}

						_context6.next = 5;
						return (0, _2.default)('' + https.url, {
							rejectUnauthorized: false,
							agent: agent
						});

					case 5:
						i++;
						_context6.next = 2;
						break;

					case 8:
						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						_context6.prev = 11;
						_iterator = Object.values(agent.freeSockets)[Symbol.iterator]();

					case 13:
						if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
							_context6.next = 37;
							break;
						}

						value = _step.value;
						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						_context6.prev = 18;

						for (_iterator2 = value[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							sock = _step2.value;

							t.is(sock.listenerCount('connect'), 0);
						}
						_context6.next = 26;
						break;

					case 22:
						_context6.prev = 22;
						_context6.t0 = _context6['catch'](18);
						_didIteratorError2 = true;
						_iteratorError2 = _context6.t0;

					case 26:
						_context6.prev = 26;
						_context6.prev = 27;

						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}

					case 29:
						_context6.prev = 29;

						if (!_didIteratorError2) {
							_context6.next = 32;
							break;
						}

						throw _iteratorError2;

					case 32:
						return _context6.finish(29);

					case 33:
						return _context6.finish(26);

					case 34:
						_iteratorNormalCompletion = true;
						_context6.next = 13;
						break;

					case 37:
						_context6.next = 43;
						break;

					case 39:
						_context6.prev = 39;
						_context6.t1 = _context6['catch'](11);
						_didIteratorError = true;
						_iteratorError = _context6.t1;

					case 43:
						_context6.prev = 43;
						_context6.prev = 44;

						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}

					case 46:
						_context6.prev = 46;

						if (!_didIteratorError) {
							_context6.next = 49;
							break;
						}

						throw _iteratorError;

					case 49:
						return _context6.finish(46);

					case 50:
						return _context6.finish(43);

					case 51:

						// Make sure to close all open sockets
						agent.destroy();

					case 52:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, undefined, [[11, 39, 43, 51], [18, 22, 26, 34], [27,, 29, 33], [44,, 46, 50]]);
	}));

	return function (_x5) {
		return _ref6.apply(this, arguments);
	};
}());

_ava2.default.after('cleanup', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
	return regeneratorRuntime.wrap(function _callee7$(_context7) {
		while (1) {
			switch (_context7.prev = _context7.next) {
				case 0:
					_context7.next = 2;
					return http.close();

				case 2:
					_context7.next = 4;
					return https.close();

				case 4:
				case 'end':
					return _context7.stop();
			}
		}
	}, _callee7, undefined);
})));