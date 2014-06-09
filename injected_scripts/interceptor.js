var initInterceptor = function () {

	var unpackArguments = function (args) {
		var result = "";
		for (var i = 0; i < args.length; i++) {
			if (args[i]) {
				result += "'" + args[i] + "', ";
			}
		}
		return result.replace(new RegExp(', jQuery'), '');
	}

	var createNestedFuncOn = function(obj, parent, childFuncName, nameSpace, args) {
		if (obj[parent] == undefined) {
			obj[parent] = {};
		}

		createFuncOn(obj[parent], childFuncName, nameSpace, args);
	}

	var createFuncOn = function(obj, funcName, namespace) {
		obj[funcName] = function () {
			jQuery.growl.error({ title:  namespace + " - <b>" + funcName + "()</b> blocked", message: "Parameters: <b>" + unpackArguments(arguments) + "</b>"});
		};
	}

	var createObj = function (nameSpace, functionNames) {
		var obj = {}
		for (var i = 0; i < functionNames.length; i++) {
			(function (functionName) {
				if (functionName.split('.').length > 1) {
					var parts = functionName.split('.');
					createNestedFuncOn(obj, parts[0], parts[1], nameSpace);
				}
				createFuncOn(obj, functionName, nameSpace)

			})(functionNames[i]);
		}
		return obj;
	}

	var createBlockedMsg = function(nameSpace) {
		jQuery.growl.error({ title: nameSpace + ' library detected', message: "We will block any tracking data from sending."});
	}

	//check if mixpanel is active
	if (typeof mixpanel !== 'undefined') {
		createBlockedMsg('Mixpanel');

		mixpanel = createObj('Mixpanel', ['init', 'push', 'disable', 'track', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'get_distinct_id', 'alias', 'set_config', 'get_config', 'get_property', 'people.set', 'people.set_once', 'people.increment', 'people.append', 'people.track_charge', 'people.clear_charges', 'people.delete_user']);
	}

	if (typeof ga !== 'undefined') {
		createBlockedMsg('Google Analytics');
		//check if GA is active
		ga = function () {
			jQuery.growl.error({ title: 'Google Analytics' + " - <b>" + arguments[0] + "()</b> blocked", message: "Parameters: <b>" + unpackArguments([].splice.call(arguments, 1)) + "</b>"});
		}
	}
	if (typeof _gaq !== 'undefined') {
		createBlockedMsg('Google Analytics');
		createFuncOn(_gaq, 'push', 'Google Analytics');
	}

	//segment.io
	if (typeof analytics !== 'undefined') {
		createBlockedMsg('Segment.io');
		createFuncOn(analytics, 'track', "Segment.io");
		createFuncOn(analytics, 'identify', "Segment.io");
		createFuncOn(analytics, 'alias', "Segment.io");
		createFuncOn(analytics, 'page', "Segment.io");
		createFuncOn(analytics, 'group', "Segment.io");
	}

	//check if kissmetrics is active
	if (typeof _kmq !== 'undefined') {
		createBlockedMsg('KissMetrics');
		_kmq = createObj('KissMetrics', ['push']);
	}
};

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
};
