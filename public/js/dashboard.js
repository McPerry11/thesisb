$(function() {
	function responsiveViewport() {
		if (window.matchMedia('only screen and (max-width: 600px)').matches) {
			$('#header .title').addClass('is-4');
			$('#header .button').addClass('is-small');
			$('#header .button p').remove();
		} else {
			$('#header .title').removeClass('is-4');
			$('#header .button').removeClass('is-small');
			if (!$('#header .button p').length) $('#header .button').append('<p>Log Out</p>');
		}
	}

	$('.pageloader .title').text('Loading Dashboard');
	$('#thesis').addClass('is-active');
	responsiveViewport();
	
	$(window).resize(function() {
		responsiveViewport();
	});

	$('#add').click(function() {
		$('.modal').addClass('is-active');
		$('html').addClass('is-clipped');
		$('.modal-card-title').text('Add Proposal');
	});

	$('.delete').click(function() {
		$('.modal').removeClass('is-active');
		$('html').removeClass('is-clipped');
	});

	$('#cancel').click(function() {
		$('.modal').removeClass('is-active');
		$('html').removeClass('is-clipped');
	});

	$('#proposal').submit(function(e) {
		e.preventDefault();
		
	});
});