jQuery('#toggle_app_btn').on('click', function() {
	var valToSet = jQuery('#toggle_app_btn').text() == 'Turn On' ? 'true' : 'false';
	chrome.storage.local.set({"analytics_interceptor_enabled": valToSet}, function () {
		if (valToSet === 'true') {
			jQuery('#toggle_app_btn').text('Turn Off');
		} else {
			jQuery('#toggle_app_btn').text('Turn On');
		}
	});
});

jQuery('#features').on('click', function() {
	jQuery('.features-div').removeClass('hide');
	jQuery('.inner.cover').addClass('hide');
	jQuery(this).parent().addClass('active');
	jQuery('#home').parent().removeClass('active');
});

jQuery('#home').on('click', function() {
	jQuery('.features-div').addClass('hide');
	jQuery('.inner.cover').removeClass('hide');
	jQuery(this).parent().addClass('active');
	jQuery('#features').parent().removeClass('active');
})

chrome.storage.local.get('analytics_interceptor_enabled', function (data) {
	if (data.analytics_interceptor_enabled === 'true') {
		jQuery('#toggle_app_btn').text('Turn Off');
	} else {
		jQuery('#toggle_app_btn').text('Turn On');
	}
});

