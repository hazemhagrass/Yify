$('.nav-tabs li a').live('click', function (event, ui) {
	$('.nav-tabs li').removeClass('active');
	$(event.target).parent().addClass('active');
});