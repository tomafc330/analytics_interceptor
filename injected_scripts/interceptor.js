/*global mixpanel: true, _kmq: true, analytics: true, ga: true, _gaq: true */
"use strict";

var initInterceptor = (function() {
	function Base() {
	}

	Base.prototype.unpackArguments = function (args) {
		var result = "";
		for (var i = 0; i < args.length; i++) {
			if (args[i]) {
				result += "'" + args[i] + "', ";
			}
		}
		return result.replace(new RegExp(', jQuery'), '');
	};
	Base.prototype.createFuncOn = function (obj, funcName, namespace) {
		var self = this;
		obj[funcName] = function () {
			jQuery.growl.error({ title: namespace + " - <b>" + funcName + "()</b> blocked", message: "Parameters: <b>" + self.unpackArguments(arguments) + "</b>"});
		};
	};
	Base.prototype.createNestedFuncOn = function (obj, parent, childFuncName, nameSpace, args) {
		if (obj[parent] === undefined) {
			obj[parent] = {};
		}

		this.createFuncOn(obj[parent], childFuncName, nameSpace, args);
	};
	Base.prototype.createObj = function (nameSpace, functionNames) {
		var obj = {};
		for (var i = 0; i < functionNames.length; i++) {
			(function (functionName, proto) {
				if (functionName.split('.').length > 1) {
					var parts = functionName.split('.');
					proto.createNestedFuncOn(obj, parts[0], parts[1], nameSpace);
				}
				proto.createFuncOn(obj, functionName, nameSpace);

			})(functionNames[i], this);
		}
		return obj;
	};

	Base.prototype.createGrowl = function(title, message) {
		jQuery.growl.error({ title: title, message: message});
	};

	Base.prototype.createBlockedMsg = function (nameSpace) {
		this.createGrowl(nameSpace + ' library detected', "We will block any tracking data from sending.");
	};


	/**
	 * Define our interceptors
	 */
	function MixPanelInterceptor() {
		this.init = function () {
			//check if mixpanel is active
			if (typeof mixpanel !== 'undefined') {
				this.createBlockedMsg('Mixpanel');

				mixpanel = this.createObj('Mixpanel', ['init', 'push', 'disable', 'track', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'get_distinct_id', 'alias', 'set_config', 'get_config', 'get_property', 'people.set', 'people.set_once', 'people.increment', 'people.append', 'people.track_charge', 'people.clear_charges', 'people.delete_user']);
			}
		};
	}
	MixPanelInterceptor.prototype = Object.create(Base.prototype);

	function GAInterceptor() {
		this.init = function() {
			var self = this;
			if (typeof ga !== 'undefined') {
				//check if GA is active
				ga = function () {
					self.createGrowl('Google Analytics' + " - <b>" + arguments[0] + "()</b> blocked", "Parameters: <b>" + self.unpackArguments([].splice.call(arguments, 1)) + "</b>");
				};
			}
			if (typeof _gaq !== 'undefined') {
				this.createFuncOn(_gaq, 'push', 'Google Analytics');
			}
		};
	}
	GAInterceptor.prototype = Object.create(Base.prototype);

	function SegmentIo() {
		this.init = function() {
			//segment.io
			if (typeof analytics !== 'undefined') {
				this.createBlockedMsg('Segment.io');
				this.createFuncOn(analytics, 'track', "Segment.io");
				this.createFuncOn(analytics, 'identify', "Segment.io");
				this.createFuncOn(analytics, 'alias', "Segment.io");
				this.createFuncOn(analytics, 'page', "Segment.io");
				this.createFuncOn(analytics, 'group', "Segment.io");
			}
		};
	}
	SegmentIo.prototype = Object.create(Base.prototype);

	function KissMetrics() {
		this.init = function() {
			//check if kissmetrics is active
			if (typeof _kmq !== 'undefined') {
				this.createBlockedMsg('KissMetrics');
				_kmq = this.createObj('KissMetrics', ['push']);
			}
		};
	}
	KissMetrics.prototype = Object.create(Base.prototype);

	return function () {
		new MixPanelInterceptor().init();
		new GAInterceptor().init();
		new SegmentIo().init();
		new KissMetrics().init();
	};

})();

//have to inject js
if (typeof jQuery === 'undefined' || typeof jQuery.growl === 'undefined') {
	var timerIdInterceptor = setInterval(function () {
		if (typeof jQuery !== 'undefined' && typeof jQuery.growl !== 'undefined') {
			clearInterval(timerIdInterceptor);
			initInterceptor();
		}
	}, 200);
} else {
	initInterceptor();
}
