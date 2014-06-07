(function () {

	var unpackArguments = function(args) {
		var result = "";
		for (var i = 0; i < args.length; i++) {
			if (args[i]) {
				result += "'" + args[i] + "', ";
			}
		}
		return result.replace(new RegExp(', $'), '');
	}
	var createObj = function (nameSpace, functionNames) {
		var obj = {}
		for (var i = 0; i < functionNames.length; i++) {
			(function(functionName) {
				if (functionName.split('.').length > 1) {
					var parts = functionName.split('.');
					if (obj[parts[0]] == undefined) {
						obj[parts[0]] = {};
					}

					obj[parts[0]][parts[1]] = function () {
						$.growl.error({ title: nameSpace + " - <b>" + functionName + "()</b> blocked", message: "Parameters: <b>" + unpackArguments(arguments) + "</b>"});
					};
				}
				obj[functionName] = function () {
					$.growl.error({ title: nameSpace + " - <b>" + functionName + "()</b> blocked", message: "Parameters: <b>" + unpackArguments(arguments) + "</b>"});
				};

			})(functionNames[i]);
		}
		return obj;
	}

//check if mixpanel is active
	if (typeof mixpanel !== 'undefined') {
		mixpanel = createObj('Mixpanel', ['init', 'push', 'disable', 'track', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'get_distinct_id', 'alias', 'set_config', 'get_config', 'get_property', 'people.set', 'people.set_once', 'people.increment', 'people.append', 'people.track_charge', 'people.clear_charges', 'people.delete_user']);
	}

	if (typeof ga !== 'undefined') {
		//check if GA is active
		ga = function() {
			$.growl.error({ title: 'Google Analytics' + " - <b>" + arguments[0] + "()</b> blocked", message: "Parameters: <b>" + unpackArguments([].splice.call(arguments, 1)) + "</b>"});
		}
	}
	if (typeof _gaq !== 'undefined') {
		_gaq = createObj('Google Analytics', 'push');
	}


	//check if kissmetrics is active
	if (typeof _kmq !== 'undefined') {
		_kmq = createObj('KissMetrics', ['push']);
	}
})();
