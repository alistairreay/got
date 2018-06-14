'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var urlLib = require('url');
var http = require('http');
var PCancelable = require('p-cancelable');
var is = require('@sindresorhus/is');

var GotError = function (_Error) {
	_inherits(GotError, _Error);

	function GotError(message, error, opts) {
		_classCallCheck(this, GotError);

		var _this = _possibleConstructorReturn(this, (GotError.__proto__ || Object.getPrototypeOf(GotError)).call(this, message));

		Error.captureStackTrace(_this, _this.constructor);
		_this.name = 'GotError';

		if (!is.undefined(error.code)) {
			_this.code = error.code;
		}

		Object.assign(_this, {
			host: opts.host,
			hostname: opts.hostname,
			method: opts.method,
			path: opts.path,
			protocol: opts.protocol,
			url: opts.href
		});
		return _this;
	}

	return GotError;
}(Error);

module.exports.GotError = GotError;

module.exports.CacheError = function (_GotError) {
	_inherits(_class, _GotError);

	function _class(error, opts) {
		_classCallCheck(this, _class);

		var _this2 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, error.message, error, opts));

		_this2.name = 'CacheError';
		return _this2;
	}

	return _class;
}(GotError);

module.exports.RequestError = function (_GotError2) {
	_inherits(_class2, _GotError2);

	function _class2(error, opts) {
		_classCallCheck(this, _class2);

		var _this3 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, error.message, error, opts));

		_this3.name = 'RequestError';
		return _this3;
	}

	return _class2;
}(GotError);

module.exports.ReadError = function (_GotError3) {
	_inherits(_class3, _GotError3);

	function _class3(error, opts) {
		_classCallCheck(this, _class3);

		var _this4 = _possibleConstructorReturn(this, (_class3.__proto__ || Object.getPrototypeOf(_class3)).call(this, error.message, error, opts));

		_this4.name = 'ReadError';
		return _this4;
	}

	return _class3;
}(GotError);

module.exports.ParseError = function (_GotError4) {
	_inherits(_class4, _GotError4);

	function _class4(error, statusCode, opts, data) {
		_classCallCheck(this, _class4);

		var _this5 = _possibleConstructorReturn(this, (_class4.__proto__ || Object.getPrototypeOf(_class4)).call(this, error.message + ' in "' + urlLib.format(opts) + '": \n' + data.slice(0, 77) + '...', error, opts));

		_this5.name = 'ParseError';
		_this5.statusCode = statusCode;
		_this5.statusMessage = http.STATUS_CODES[_this5.statusCode];
		return _this5;
	}

	return _class4;
}(GotError);

module.exports.HTTPError = function (_GotError5) {
	_inherits(_class5, _GotError5);

	function _class5(statusCode, statusMessage, headers, opts) {
		_classCallCheck(this, _class5);

		if (statusMessage) {
			statusMessage = statusMessage.replace(/\r?\n/g, ' ').trim();
		} else {
			statusMessage = http.STATUS_CODES[statusCode];
		}

		var _this6 = _possibleConstructorReturn(this, (_class5.__proto__ || Object.getPrototypeOf(_class5)).call(this, 'Response code ' + statusCode + ' (' + statusMessage + ')', {}, opts));

		_this6.name = 'HTTPError';
		_this6.statusCode = statusCode;
		_this6.statusMessage = statusMessage;
		_this6.headers = headers;
		return _this6;
	}

	return _class5;
}(GotError);

module.exports.MaxRedirectsError = function (_GotError6) {
	_inherits(_class6, _GotError6);

	function _class6(statusCode, redirectUrls, opts) {
		_classCallCheck(this, _class6);

		var _this7 = _possibleConstructorReturn(this, (_class6.__proto__ || Object.getPrototypeOf(_class6)).call(this, 'Redirected 10 times. Aborting.', {}, opts));

		_this7.name = 'MaxRedirectsError';
		_this7.statusCode = statusCode;
		_this7.statusMessage = http.STATUS_CODES[_this7.statusCode];
		_this7.redirectUrls = redirectUrls;
		return _this7;
	}

	return _class6;
}(GotError);

module.exports.UnsupportedProtocolError = function (_GotError7) {
	_inherits(_class7, _GotError7);

	function _class7(opts) {
		_classCallCheck(this, _class7);

		var _this8 = _possibleConstructorReturn(this, (_class7.__proto__ || Object.getPrototypeOf(_class7)).call(this, 'Unsupported protocol "' + opts.protocol + '"', {}, opts));

		_this8.name = 'UnsupportedProtocolError';
		return _this8;
	}

	return _class7;
}(GotError);

module.exports.CancelError = PCancelable.CancelError;
