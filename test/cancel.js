'use strict';

var createAbortServer = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
		var _this = this;

		var s, ee;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return (0, _server.createServer)();

					case 2:
						s = _context2.sent;
						ee = new _events2.default();

						ee.aborted = new Promise(function (resolve, reject) {
							s.on('/abort', function () {
								var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
									return regeneratorRuntime.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													ee.emit('connection');
													req.on('aborted', resolve);
													res.on('finish', reject.bind(null, new Error('Request finished instead of aborting.')));

													_context.next = 5;
													return (0, _getStream2.default)(req);

												case 5:
													res.end();

												case 6:
												case 'end':
													return _context.stop();
											}
										}
									}, _callee, _this);
								}));

								return function (_x, _x2) {
									return _ref2.apply(this, arguments);
								};
							}());

							s.on('/redirect', function (req, res) {
								res.writeHead(302, {
									location: s.url + '/abort'
								});
								res.end();

								ee.emit('sentRedirect');

								setTimeout(resolve, 3000);
							});
						});

						_context2.next = 7;
						return s.listen(s.port);

					case 7:
						ee.url = s.url + '/abort';
						ee.redirectUrl = s.url + '/redirect';

						return _context2.abrupt('return', ee);

					case 10:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function createAbortServer() {
		return _ref.apply(this, arguments);
	};
}();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _stream = require('stream');

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _getStream = require('get-stream');

var _getStream2 = _interopRequireDefault(_getStream);

var _pCancelable = require('p-cancelable');

var _pCancelable2 = _interopRequireDefault(_pCancelable);

var _2 = require('..');

var _3 = _interopRequireDefault(_2);

var _server = require('./helpers/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(0, _ava2.default)('cancel do not retry after cancelation', function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var helper, p;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return createAbortServer();

					case 2:
						helper = _context3.sent;
						p = (0, _3.default)(helper.redirectUrl, {
							retries: function retries(_) {
								t.fail('Makes a new try after cancelation');
							}
						});


						helper.on('sentRedirect', function () {
							p.cancel();
						});

						_context3.next = 7;
						return t.throws(p, _pCancelable2.default.CancelError);

					case 7:
						_context3.next = 9;
						return t.notThrows(helper.aborted, 'Request finished instead of aborting.');

					case 9:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function (_x3) {
		return _ref3.apply(this, arguments);
	};
}());

(0, _ava2.default)('cancel in-progress request', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var helper, body, p;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return createAbortServer();

					case 2:
						helper = _context4.sent;
						body = new _stream.Readable({
							read: function read() {}
						});

						body.push('1');

						p = (0, _3.default)(helper.url, { body: body });

						// Wait for the connection to be established before canceling

						helper.on('connection', function () {
							p.cancel();
							body.push(null);
						});

						_context4.next = 9;
						return t.throws(p, _pCancelable2.default.CancelError);

					case 9:
						_context4.next = 11;
						return t.notThrows(helper.aborted, 'Request finished instead of aborting.');

					case 11:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function (_x4) {
		return _ref4.apply(this, arguments);
	};
}());

(0, _ava2.default)('cancel in-progress request with timeout', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var helper, body, p;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return createAbortServer();

					case 2:
						helper = _context5.sent;
						body = new _stream.Readable({
							read: function read() {}
						});

						body.push('1');

						p = (0, _3.default)(helper.url, { body: body, timeout: 10000 });

						// Wait for the connection to be established before canceling

						helper.on('connection', function () {
							p.cancel();
							body.push(null);
						});

						_context5.next = 9;
						return t.throws(p, _pCancelable2.default.CancelError);

					case 9:
						_context5.next = 11;
						return t.notThrows(helper.aborted, 'Request finished instead of aborting.');

					case 11:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, undefined);
	}));

	return function (_x5) {
		return _ref5.apply(this, arguments);
	};
}());

(0, _ava2.default)('cancel immediately', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var s, aborted, p;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.next = 2;
						return (0, _server.createServer)();

					case 2:
						s = _context6.sent;
						aborted = new Promise(function (resolve, reject) {
							// We won't get an abort or even a connection
							// We assume no request within 1000ms equals a (client side) aborted request
							s.on('/abort', function (req, res) {
								res.on('finish', reject.bind(undefined, new Error('Request finished instead of aborting.')));
								res.end();
							});
							setTimeout(resolve, 1000);
						});
						_context6.next = 6;
						return s.listen(s.port);

					case 6:
						p = (0, _3.default)(s.url + '/abort');

						p.cancel();
						_context6.next = 10;
						return t.throws(p);

					case 10:
						_context6.next = 12;
						return t.notThrows(aborted, 'Request finished instead of aborting.');

					case 12:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, undefined);
	}));

	return function (_x6) {
		return _ref6.apply(this, arguments);
	};
}());

(0, _ava2.default)('recover from cancelation using cancelable promise attribute', function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		var p, recover;
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						// Canceled before connection started
						p = (0, _3.default)('http://example.com');
						recover = p.catch(function (err) {
							if (p.isCanceled) {
								return;
							}

							throw err;
						});


						p.cancel();

						_context7.next = 5;
						return t.notThrows(recover);

					case 5:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, undefined);
	}));

	return function (_x7) {
		return _ref7.apply(this, arguments);
	};
}());

(0, _ava2.default)('recover from cancellation using error instance', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		var p, recover;
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						// Canceled before connection started
						p = (0, _3.default)('http://example.com');
						recover = p.catch(function (err) {
							if (err instanceof _3.default.CancelError) {
								return;
							}

							throw err;
						});


						p.cancel();

						_context8.next = 5;
						return t.notThrows(recover);

					case 5:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, undefined);
	}));

	return function (_x8) {
		return _ref8.apply(this, arguments);
	};
}());