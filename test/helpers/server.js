'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var util = require('util');
var http = require('http');
var https = require('https');
var getPort = require('get-port');

exports.host = 'localhost';
var _exports = exports,
    host = _exports.host;


exports.createServer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	var port, s;
	return regeneratorRuntime.wrap(function _callee$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return getPort();

				case 2:
					port = _context.sent;
					s = http.createServer(function (request, response) {
						s.emit(request.url, request, response);
					});


					s.host = host;
					s.port = port;
					s.url = 'http://' + host + ':' + port;
					s.protocol = 'http';

					s.listen = util.promisify(s.listen);
					s.close = util.promisify(s.close);

					return _context.abrupt('return', s);

				case 11:
				case 'end':
					return _context.stop();
			}
		}
	}, _callee, undefined);
}));

exports.createSSLServer = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(options) {
		var port, s;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return getPort();

					case 2:
						port = _context2.sent;
						s = https.createServer(options, function (request, response) {
							s.emit(request.url, request, response);
						});


						s.host = host;
						s.port = port;
						s.url = 'https://' + host + ':' + port;
						s.protocol = 'https';

						s.listen = util.promisify(s.listen);
						s.close = util.promisify(s.close);

						return _context2.abrupt('return', s);

					case 11:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function (_x) {
		return _ref2.apply(this, arguments);
	};
}();