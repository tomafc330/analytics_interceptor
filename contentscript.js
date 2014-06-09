/**
 * Adds a script to the injected page.
 * @param name
 */
function addScript(name) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(name);
	s.onload = function () {
		this.parentNode.removeChild(this);
	};
	(document.head || document.documentElement).appendChild(s);
}

function addCss(name) {
	var s = document.createElement('link');
	s.href = chrome.extension.getURL(name);
	s.rel = "stylesheet";
	s.type = "text/css";
	s.media = "all";
	(document.head || document.documentElement).appendChild(s);
}

/**
 * Adds a variable to the injected page so that the inject script can reference it
 * @param varName
 * @param value
 */
function addVar(varName, value) {
	var s = document.createElement('script');
	s.textContent = "var " + varName + " = '" + value + "';";
	(document.head || document.documentElement).appendChild(s);
}

chrome.storage.local.get({
	analytics_interceptor_enabled: 'true'
}, function (data) {

	if (data.analytics_interceptor_enabled === 'true') {
		addScript('lib/conditional_jquery.js');
		addCss('lib/jquery.growl.css');

		//TODO: don't use setTimeout to wait for jQuery to load
//		setTimeout(function() {
			addScript('lib/jquery.growl.js');
			addScript('injected_scripts/interceptor.js');
//		}, 800);
	}
});
