'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var util = require('util');
var EventEmitter = require('events');
var http = require('http');
var https = require('https');

var _require = require('stream'),
    PassThrough = _require.PassThrough,
    Transform = _require.Transform;

var urlLib = require('url');
var fs = require('fs');
var querystring = require('querystring');
var CacheableRequest = require('cacheable-request');
var duplexer3 = require('duplexer3');
var toReadableStream = require('to-readable-stream');
var is = require('@sindresorhus/is');
var getStream = require('get-stream');
var timedOut = require('timed-out');
var urlParseLax = require('url-parse-lax');
var urlToOptions = require('url-to-options');
var lowercaseKeys = require('lowercase-keys');
var decompressResponse = require('decompress-response');
var mimicResponse = require('mimic-response');
var isRetryAllowed = require('is-retry-allowed');
var isURL = require('isurl');
var PCancelable = require('p-cancelable');
var pTimeout = require('p-timeout');
var pkg = require('./package.json');
var errors = require('./errors');

var getMethodRedirectCodes = new Set([300, 301, 302, 303, 304, 305, 307, 308]);
var allMethodRedirectCodes = new Set([300, 303, 307, 308]);

var isFormData = function isFormData(body) {
	return is.nodeStream(body) && is.function(body.getBoundary);
};

var getBodySize = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opts) {
		var body, _ref2, size;

		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						body = opts.body;

						if (!opts.headers['content-length']) {
							_context.next = 3;
							break;
						}

						return _context.abrupt('return', Number(opts.headers['content-length']));

					case 3:
						if (!(!body && !opts.stream)) {
							_context.next = 5;
							break;
						}

						return _context.abrupt('return', 0);

					case 5:
						if (!is.string(body)) {
							_context.next = 7;
							break;
						}

						return _context.abrupt('return', Buffer.byteLength(body));

					case 7:
						if (!isFormData(body)) {
							_context.next = 9;
							break;
						}

						return _context.abrupt('return', util.promisify(body.getLength.bind(body))());

					case 9:
						if (!(body instanceof fs.ReadStream)) {
							_context.next = 15;
							break;
						}

						_context.next = 12;
						return util.promisify(fs.stat)(body.path);

					case 12:
						_ref2 = _context.sent;
						size = _ref2.size;
						return _context.abrupt('return', size);

					case 15:
						if (!(is.nodeStream(body) && is.buffer(body._buffer))) {
							_context.next = 17;
							break;
						}

						return _context.abrupt('return', body._buffer.length);

					case 17:
						return _context.abrupt('return', null);

					case 18:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function getBodySize(_x) {
		return _ref.apply(this, arguments);
	};
}();

function requestAsEventEmitter(opts) {
	var _this = this;

	opts = opts || {};

	var ee = new EventEmitter();
	var requestUrl = opts.href || urlLib.resolve(urlLib.format(opts), opts.path);
	var redirects = [];
	var agents = is.object(opts.agent) ? opts.agent : null;
	var retryCount = 0;
	var redirectUrl = void 0;
	var uploadBodySize = void 0;
	var uploaded = 0;

	var get = function get(opts) {
		if (opts.protocol !== 'http:' && opts.protocol !== 'https:') {
			ee.emit('error', new got.UnsupportedProtocolError(opts));
			return;
		}

		var fn = opts.protocol === 'https:' ? https : http;

		if (agents) {
			var protocolName = opts.protocol === 'https:' ? 'https' : 'http';
			opts.agent = agents[protocolName] || opts.agent;
		}

		if (opts.useElectronNet && process.versions.electron) {
			var electron = require('electron');
			fn = electron.net || electron.remote.net;
		}

		var progressInterval = void 0;

		var cacheableRequest = new CacheableRequest(fn.request, opts.cache);
		var cacheReq = cacheableRequest(opts, function (res) {
			clearInterval(progressInterval);

			ee.emit('uploadProgress', {
				percent: 1,
				transferred: uploaded,
				total: uploadBodySize
			});

			var statusCode = res.statusCode;


			res.url = redirectUrl || requestUrl;
			res.requestUrl = requestUrl;

			var followRedirect = opts.followRedirect && 'location' in res.headers;
			var redirectGet = followRedirect && getMethodRedirectCodes.has(statusCode);
			var redirectAll = followRedirect && allMethodRedirectCodes.has(statusCode);

			if (redirectAll || redirectGet && (opts.method === 'GET' || opts.method === 'HEAD')) {
				res.resume();

				if (statusCode === 303) {
					// Server responded with "see other", indicating that the resource exists at another location,
					// and the client should request it from that location via GET or HEAD.
					opts.method = 'GET';
				}

				if (redirects.length >= 10) {
					ee.emit('error', new got.MaxRedirectsError(statusCode, redirects, opts), null, res);
					return;
				}

				var bufferString = Buffer.from(res.headers.location, 'binary').toString();

				redirectUrl = urlLib.resolve(urlLib.format(opts), bufferString);

				redirects.push(redirectUrl);

				var redirectOpts = _extends({}, opts, urlLib.parse(redirectUrl));

				ee.emit('redirect', res, redirectOpts);

				get(redirectOpts);

				return;
			}

			setImmediate(function () {
				try {
					getResponse(res, opts, ee, redirects);
				} catch (e) {
					ee.emit('error', e);
				}
			});
		});

		cacheReq.on('error', function (err) {
			if (err instanceof CacheableRequest.RequestError) {
				ee.emit('error', new got.RequestError(err, opts));
			} else {
				ee.emit('error', new got.CacheError(err, opts));
			}
		});

		cacheReq.once('request', function (req) {
			var aborted = false;
			req.once('abort', function (_) {
				aborted = true;
			});

			req.once('error', function (err) {
				clearInterval(progressInterval);

				if (aborted) {
					return;
				}

				var backoff = opts.retries(++retryCount, err);

				if (backoff) {
					setTimeout(get, backoff, opts);
					return;
				}

				ee.emit('error', new got.RequestError(err, opts));
			});

			ee.once('request', function (req) {
				ee.emit('uploadProgress', {
					percent: 0,
					transferred: 0,
					total: uploadBodySize
				});

				var socket = req.connection;
				if (socket) {
					var onSocketConnect = function onSocketConnect() {
						var uploadEventFrequency = 150;

						progressInterval = setInterval(function () {
							if (socket.destroyed) {
								clearInterval(progressInterval);
								return;
							}

							var lastUploaded = uploaded;
							var headersSize = Buffer.byteLength(req._header);
							uploaded = socket.bytesWritten - headersSize;

							// Prevent the known issue of `bytesWritten` being larger than body size
							if (uploadBodySize && uploaded > uploadBodySize) {
								uploaded = uploadBodySize;
							}

							// Don't emit events with unchanged progress and
							// prevent last event from being emitted, because
							// it's emitted when `response` is emitted
							if (uploaded === lastUploaded || uploaded === uploadBodySize) {
								return;
							}

							ee.emit('uploadProgress', {
								percent: uploadBodySize ? uploaded / uploadBodySize : 0,
								transferred: uploaded,
								total: uploadBodySize
							});
						}, uploadEventFrequency);
					};

					// Only subscribe to `connect` event if we're actually connecting a new
					// socket, otherwise if we're already connected (because this is a
					// keep-alive connection) do not bother. This is important since we won't
					// get a `connect` event for an already connected socket.
					if (socket.connecting) {
						socket.once('connect', onSocketConnect);
					} else {
						onSocketConnect();
					}
				}
			});

			if (opts.gotTimeout) {
				clearInterval(progressInterval);
				timedOut(req, opts.gotTimeout);
			}

			setImmediate(function () {
				ee.emit('request', req);
			});
		});
	};

	setImmediate(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.prev = 0;
						_context2.next = 3;
						return getBodySize(opts);

					case 3:
						uploadBodySize = _context2.sent;


						// This is the second try at setting a `content-length` header.
						// This supports getting the size async, in contrast to
						// https://github.com/sindresorhus/got/blob/82763c8089596dcee5eaa7f57f5dbf8194842fe6/index.js#L579-L582
						// TODO: We should unify these two at some point
						if (uploadBodySize > 0 && is.undefined(opts.headers['content-length']) && is.undefined(opts.headers['transfer-encoding'])) {
							opts.headers['content-length'] = uploadBodySize;
						}

						get(opts);
						_context2.next = 11;
						break;

					case 8:
						_context2.prev = 8;
						_context2.t0 = _context2['catch'](0);

						ee.emit('error', _context2.t0);

					case 11:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, _this, [[0, 8]]);
	})));

	return ee;
}

function getResponse(res, opts, ee, redirects) {
	var downloadBodySize = Number(res.headers['content-length']) || null;
	var downloaded = 0;

	var progressStream = new Transform({
		transform: function transform(chunk, encoding, callback) {
			downloaded += chunk.length;

			var percent = downloadBodySize ? downloaded / downloadBodySize : 0;

			// Let flush() be responsible for emitting the last event
			if (percent < 1) {
				ee.emit('downloadProgress', {
					percent: percent,
					transferred: downloaded,
					total: downloadBodySize
				});
			}

			callback(null, chunk);
		},
		flush: function flush(callback) {
			ee.emit('downloadProgress', {
				percent: 1,
				transferred: downloaded,
				total: downloadBodySize
			});

			callback();
		}
	});

	mimicResponse(res, progressStream);
	progressStream.redirectUrls = redirects;

	var response = opts.decompress === true && is.function(decompressResponse) && opts.method !== 'HEAD' ? decompressResponse(progressStream) : progressStream;

	if (!opts.decompress && ['gzip', 'deflate'].includes(res.headers['content-encoding'])) {
		opts.encoding = null;
	}

	ee.emit('response', response);

	ee.emit('downloadProgress', {
		percent: 0,
		transferred: 0,
		total: downloadBodySize
	});

	res.pipe(progressStream);
}

function asPromise(opts) {
	var _this2 = this;

	var timeoutFn = function timeoutFn(requestPromise) {
		return opts.gotTimeout && opts.gotTimeout.request ? pTimeout(requestPromise, opts.gotTimeout.request, new got.RequestError({ message: 'Request timed out', code: 'ETIMEDOUT' }, opts)) : requestPromise;
	};

	var proxy = new EventEmitter();

	var cancelable = new PCancelable(function (resolve, reject, onCancel) {
		var ee = requestAsEventEmitter(opts);
		var cancelOnRequest = false;

		onCancel(function () {
			cancelOnRequest = true;
		});

		ee.on('request', function (req) {
			if (cancelOnRequest) {
				req.abort();
			}

			onCancel(function () {
				req.abort();
			});

			if (is.nodeStream(opts.body)) {
				opts.body.pipe(req);
				opts.body = undefined;
				return;
			}

			req.end(opts.body);
		});

		ee.on('response', function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(res) {
				var stream, data, statusCode, limitStatusCode, parseError, err;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								stream = is.null(opts.encoding) ? getStream.buffer(res) : getStream(res, opts);
								data = void 0;
								_context3.prev = 2;
								_context3.next = 5;
								return stream;

							case 5:
								data = _context3.sent;
								_context3.next = 12;
								break;

							case 8:
								_context3.prev = 8;
								_context3.t0 = _context3['catch'](2);

								reject(new got.ReadError(_context3.t0, opts));
								return _context3.abrupt('return');

							case 12:
								statusCode = res.statusCode;
								limitStatusCode = opts.followRedirect ? 299 : 399;


								res.body = data;

								if (opts.json && res.body) {
									try {
										res.body = JSON.parse(res.body);
									} catch (err) {
										if (statusCode >= 200 && statusCode < 300) {
											parseError = new got.ParseError(err, statusCode, opts, data);

											Object.defineProperty(parseError, 'response', { value: res });
											reject(parseError);
										}
									}
								}

								if (opts.throwHttpErrors && statusCode !== 304 && (statusCode < 200 || statusCode > limitStatusCode)) {
									err = new got.HTTPError(statusCode, res.statusMessage, res.headers, opts);

									Object.defineProperty(err, 'response', { value: res });
									reject(err);
								}

								resolve(res);

							case 18:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, _this2, [[2, 8]]);
			}));

			return function (_x2) {
				return _ref4.apply(this, arguments);
			};
		}());

		ee.once('error', reject);
		ee.on('redirect', proxy.emit.bind(proxy, 'redirect'));
		ee.on('uploadProgress', proxy.emit.bind(proxy, 'uploadProgress'));
		ee.on('downloadProgress', proxy.emit.bind(proxy, 'downloadProgress'));
	});

	var promise = timeoutFn(cancelable);

	promise.cancel = cancelable.cancel.bind(cancelable);

	promise.on = function (name, fn) {
		proxy.on(name, fn);
		return promise;
	};

	return promise;
}

function asStream(opts) {
	opts.stream = true;

	var input = new PassThrough();
	var output = new PassThrough();
	var proxy = duplexer3(input, output);
	var timeout = void 0;

	if (opts.gotTimeout && opts.gotTimeout.request) {
		timeout = setTimeout(function () {
			proxy.emit('error', new got.RequestError({ message: 'Request timed out', code: 'ETIMEDOUT' }, opts));
		}, opts.gotTimeout.request);
	}

	if (opts.json) {
		throw new Error('Got can not be used as a stream when the `json` option is used');
	}

	if (opts.body) {
		proxy.write = function () {
			throw new Error('Got\'s stream is not writable when the `body` option is used');
		};
	}

	var ee = requestAsEventEmitter(opts);

	ee.on('request', function (req) {
		proxy.emit('request', req);

		if (is.nodeStream(opts.body)) {
			opts.body.pipe(req);
			return;
		}

		if (opts.body) {
			req.end(opts.body);
			return;
		}

		if (opts.method === 'POST' || opts.method === 'PUT' || opts.method === 'PATCH') {
			input.pipe(req);
			return;
		}

		req.end();
	});

	ee.on('response', function (res) {
		clearTimeout(timeout);

		var statusCode = res.statusCode;


		res.on('error', function (err) {
			proxy.emit('error', new got.ReadError(err, opts));
		});

		res.pipe(output);

		if (opts.throwHttpErrors && statusCode !== 304 && (statusCode < 200 || statusCode > 299)) {
			proxy.emit('error', new got.HTTPError(statusCode, res.statusMessage, res.headers, opts), null, res);
			return;
		}

		proxy.emit('response', res);
	});

	ee.on('error', proxy.emit.bind(proxy, 'error'));
	ee.on('redirect', proxy.emit.bind(proxy, 'redirect'));
	ee.on('uploadProgress', proxy.emit.bind(proxy, 'uploadProgress'));
	ee.on('downloadProgress', proxy.emit.bind(proxy, 'downloadProgress'));

	return proxy;
}

function normalizeArguments(url, opts) {
	if (!is.string(url) && !is.object(url)) {
		throw new TypeError('Parameter `url` must be a string or object, not ' + is(url));
	} else if (is.string(url)) {
		url = url.replace(/^unix:/, 'http://$&');

		try {
			decodeURI(url);
		} catch (err) {
			throw new Error('Parameter `url` must contain valid UTF-8 character sequences');
		}

		url = urlParseLax(url);
		if (url.auth) {
			throw new Error('Basic authentication must be done with the `auth` option');
		}
	} else if (isURL.lenient(url)) {
		url = urlToOptions(url);
	}

	var defaults = {
		path: '',
		retries: 2,
		cache: false,
		decompress: true,
		useElectronNet: false,
		throwHttpErrors: true
	};

	opts = _extends({}, defaults, url, {
		protocol: url.protocol || 'http:' }, opts);

	var headers = lowercaseKeys(opts.headers);
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.entries(headers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _ref5 = _step.value;

			var _ref6 = _slicedToArray(_ref5, 2);

			var key = _ref6[0];
			var value = _ref6[1];

			if (is.nullOrUndefined(value)) {
				delete headers[key];
			}
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

	opts.headers = _extends({
		'user-agent': pkg.name + '/' + pkg.version + ' (https://github.com/sindresorhus/got)'
	}, headers);

	if (opts.decompress && is.undefined(opts.headers['accept-encoding'])) {
		opts.headers['accept-encoding'] = 'gzip, deflate';
	}

	var _opts = opts,
	    query = _opts.query;


	if (query) {
		if (!is.string(query)) {
			opts.query = querystring.stringify(query);
		}

		opts.path = opts.path.split('?')[0] + '?' + opts.query;
		delete opts.query;
	}

	if (opts.json && is.undefined(opts.headers.accept)) {
		opts.headers.accept = 'application/json';
	}

	var _opts2 = opts,
	    body = _opts2.body;

	if (is.nullOrUndefined(body)) {
		opts.method = (opts.method || 'GET').toUpperCase();
	} else {
		var _opts3 = opts,
		    _headers = _opts3.headers;

		if (!is.nodeStream(body) && !is.string(body) && !is.buffer(body) && !(opts.form || opts.json)) {
			throw new TypeError('The `body` option must be a stream.Readable, string, Buffer or plain Object');
		}

		var canBodyBeStringified = is.plainObject(body) || is.array(body);
		if ((opts.form || opts.json) && !canBodyBeStringified) {
			throw new TypeError('The `body` option must be a plain Object or Array when the `form` or `json` option is used');
		}

		if (isFormData(body)) {
			// Special case for https://github.com/form-data/form-data
			_headers['content-type'] = _headers['content-type'] || 'multipart/form-data; boundary=' + body.getBoundary();
		} else if (opts.form && canBodyBeStringified) {
			_headers['content-type'] = _headers['content-type'] || 'application/x-www-form-urlencoded';
			opts.body = querystring.stringify(body);
		} else if (opts.json && canBodyBeStringified) {
			_headers['content-type'] = _headers['content-type'] || 'application/json';
			opts.body = JSON.stringify(body);
		}

		if (is.undefined(_headers['content-length']) && is.undefined(_headers['transfer-encoding']) && !is.nodeStream(body)) {
			var length = is.string(opts.body) ? Buffer.byteLength(opts.body) : opts.body.length;
			_headers['content-length'] = length;
		}

		// Convert buffer to stream to receive upload progress events (#322)
		if (is.buffer(body)) {
			opts.body = toReadableStream(body);
			opts.body._buffer = body;
		}

		opts.method = (opts.method || 'POST').toUpperCase();
	}

	if (opts.hostname === 'unix') {
		var matches = /(.+?):(.+)/.exec(opts.path);

		if (matches) {
			var _matches = _slicedToArray(matches, 3),
			    socketPath = _matches[1],
			    path = _matches[2];

			opts = _extends({}, opts, {
				socketPath: socketPath,
				path: path,
				host: null
			});
		}
	}

	if (!is.function(opts.retries)) {
		var _opts4 = opts,
		    retries = _opts4.retries;


		opts.retries = function (iter, err) {
			if (iter > retries || !isRetryAllowed(err)) {
				return 0;
			}

			var noise = Math.random() * 100;

			return (1 << iter) * 1000 + noise;
		};
	}

	if (is.undefined(opts.followRedirect)) {
		opts.followRedirect = true;
	}

	if (opts.timeout) {
		if (is.number(opts.timeout)) {
			opts.gotTimeout = { request: opts.timeout };
		} else {
			opts.gotTimeout = opts.timeout;
		}
		delete opts.timeout;
	}

	return opts;
}

function got(url, opts) {
	try {
		var normalizedArgs = normalizeArguments(url, opts);

		if (normalizedArgs.stream) {
			return asStream(normalizedArgs);
		}

		return asPromise(normalizedArgs);
	} catch (err) {
		return Promise.reject(err);
	}
}

got.stream = function (url, opts) {
	return asStream(normalizeArguments(url, opts));
};

var methods = ['get', 'post', 'put', 'patch', 'head', 'delete'];

var _loop = function _loop(method) {
	got[method] = function (url, options) {
		return got(url, _extends({}, options, { method: method }));
	};
	got.stream[method] = function (url, options) {
		return got.stream(url, _extends({}, options, { method: method }));
	};
};

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
	for (var _iterator2 = methods[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
		var method = _step2.value;

		_loop(method);
	}
} catch (err) {
	_didIteratorError2 = true;
	_iteratorError2 = err;
} finally {
	try {
		if (!_iteratorNormalCompletion2 && _iterator2.return) {
			_iterator2.return();
		}
	} finally {
		if (_didIteratorError2) {
			throw _iteratorError2;
		}
	}
}

Object.assign(got, errors);

module.exports = got;
