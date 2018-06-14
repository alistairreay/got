'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _slowStream = require('slow-stream');

var _slowStream2 = _interopRequireDefault(_slowStream);

var _toReadableStream = require('to-readable-stream');

var _toReadableStream2 = _interopRequireDefault(_toReadableStream);

var _getStream = require('get-stream');

var _getStream2 = _interopRequireDefault(_getStream);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _tempfile = require('tempfile');

var _tempfile2 = _interopRequireDefault(_tempfile);

var _is = require('@sindresorhus/is');

var _is2 = _interopRequireDefault(_is);

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _server = require('./helpers/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var checkEvents = function checkEvents(t, events) {
	var bodySize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	t.true(events.length >= 2);

	var hasBodySize = _is2.default.number(bodySize);
	var lastEvent = events.shift();

	if (!hasBodySize) {
		t.is(lastEvent.percent, 0);
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = events.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _ref = _step.value;

			var _ref2 = _slicedToArray(_ref, 2);

			var index = _ref2[0];
			var event = _ref2[1];

			if (hasBodySize) {
				t.is(event.percent, event.transferred / bodySize);
				t.true(event.percent > lastEvent.percent);
			} else {
				var isLastEvent = index === events.length - 1;
				t.is(event.percent, isLastEvent ? 1 : 0);
			}

			t.true(event.transferred >= lastEvent.transferred);
			t.is(event.total, bodySize);

			lastEvent = event;
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}
};

var file = Buffer.alloc(1024 * 1024 * 2);
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


					s.on('/download', function (req, res) {
						res.setHeader('content-length', file.length);

						(0, _toReadableStream2.default)(file).pipe(new _slowStream2.default({ maxWriteInterval: 50 })).pipe(res);
					});

					s.on('/download/no-total', function (req, res) {
						res.write('hello');
						res.end();
					});

					s.on('/upload', function (req, res) {
						req.pipe(new _slowStream2.default({ maxWriteInterval: 100 })).on('end', function () {
							return res.end();
						});
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

(0, _ava2.default)('download progress', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
		var events, res;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						events = [];
						_context2.next = 3;
						return (0, _2.default)(s.url + '/download', { encoding: null }).on('downloadProgress', function (e) {
							return events.push(e);
						});

					case 3:
						res = _context2.sent;


						checkEvents(t, events, res.body.length);

					case 5:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function (_x2) {
		return _ref4.apply(this, arguments);
	};
}());

(0, _ava2.default)('download progress - missing total size', function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
		var events;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						events = [];
						_context3.next = 3;
						return (0, _2.default)(s.url + '/download/no-total').on('downloadProgress', function (e) {
							return events.push(e);
						});

					case 3:

						checkEvents(t, events);

					case 4:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function (_x3) {
		return _ref5.apply(this, arguments);
	};
}());

(0, _ava2.default)('download progress - stream', function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
		var events, stream;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						events = [];
						stream = _2.default.stream(s.url + '/download', { encoding: null }).on('downloadProgress', function (e) {
							return events.push(e);
						});
						_context4.next = 4;
						return (0, _getStream2.default)(stream);

					case 4:

						checkEvents(t, events, file.length);

					case 5:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function (_x4) {
		return _ref6.apply(this, arguments);
	};
}());

(0, _ava2.default)('upload progress - file', function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
		var events;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						events = [];
						_context5.next = 3;
						return _2.default.post(s.url + '/upload', { body: file }).on('uploadProgress', function (e) {
							return events.push(e);
						});

					case 3:

						checkEvents(t, events, file.length);

					case 4:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, undefined);
	}));

	return function (_x5) {
		return _ref7.apply(this, arguments);
	};
}());

(0, _ava2.default)('upload progress - file stream', function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
		var path, events;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						path = (0, _tempfile2.default)();

						_fs2.default.writeFileSync(path, file);

						events = [];
						_context6.next = 5;
						return _2.default.post(s.url + '/upload', { body: _fs2.default.createReadStream(path) }).on('uploadProgress', function (e) {
							return events.push(e);
						});

					case 5:

						checkEvents(t, events, file.length);

					case 6:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, undefined);
	}));

	return function (_x6) {
		return _ref8.apply(this, arguments);
	};
}());

(0, _ava2.default)('upload progress - form data', function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
		var events, body, size;
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						events = [];
						body = new _formData2.default();

						body.append('key', 'value');
						body.append('file', file);

						_context7.next = 6;
						return _util2.default.promisify(body.getLength.bind(body))();

					case 6:
						size = _context7.sent;
						_context7.next = 9;
						return _2.default.post(s.url + '/upload', { body: body }).on('uploadProgress', function (e) {
							return events.push(e);
						});

					case 9:

						checkEvents(t, events, size);

					case 10:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, undefined);
	}));

	return function (_x7) {
		return _ref9.apply(this, arguments);
	};
}());

(0, _ava2.default)('upload progress - json', function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
		var body, size, events;
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						body = JSON.stringify({ key: 'value' });
						size = Buffer.byteLength(body);
						events = [];
						_context8.next = 5;
						return _2.default.post(s.url + '/upload', { body: body }).on('uploadProgress', function (e) {
							return events.push(e);
						});

					case 5:

						checkEvents(t, events, size);

					case 6:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, undefined);
	}));

	return function (_x8) {
		return _ref10.apply(this, arguments);
	};
}());

(0, _ava2.default)('upload progress - stream with known body size', function () {
	var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
		var events, options, req;
		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						events = [];
						options = {
							headers: { 'content-length': file.length }
						};
						req = _2.default.stream.post(s.url + '/upload', options).on('uploadProgress', function (e) {
							return events.push(e);
						});
						_context9.next = 5;
						return (0, _getStream2.default)((0, _toReadableStream2.default)(file).pipe(req));

					case 5:

						checkEvents(t, events, file.length);

					case 6:
					case 'end':
						return _context9.stop();
				}
			}
		}, _callee9, undefined);
	}));

	return function (_x9) {
		return _ref11.apply(this, arguments);
	};
}());

(0, _ava2.default)('upload progress - stream with unknown body size', function () {
	var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
		var events, req;
		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						events = [];
						req = _2.default.stream.post(s.url + '/upload').on('uploadProgress', function (e) {
							return events.push(e);
						});
						_context10.next = 4;
						return (0, _getStream2.default)((0, _toReadableStream2.default)(file).pipe(req));

					case 4:

						checkEvents(t, events);

					case 5:
					case 'end':
						return _context10.stop();
				}
			}
		}, _callee10, undefined);
	}));

	return function (_x10) {
		return _ref12.apply(this, arguments);
	};
}());

(0, _ava2.default)('upload progress - no body', function () {
	var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
		var events;
		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						events = [];
						_context11.next = 3;
						return _2.default.post(s.url + '/upload').on('uploadProgress', function (e) {
							return events.push(e);
						});

					case 3:

						t.deepEqual(events, [{
							percent: 0,
							transferred: 0,
							total: 0
						}, {
							percent: 1,
							transferred: 0,
							total: 0
						}]);

					case 4:
					case 'end':
						return _context11.stop();
				}
			}
		}, _callee11, undefined);
	}));

	return function (_x11) {
		return _ref13.apply(this, arguments);
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