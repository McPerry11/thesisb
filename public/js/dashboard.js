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

	function getStudentInfo(students, studentnums) {
		for (let i = 1; i < 6; i++) {
			if ($('#sname' + i).val() == '' || $('#snum' + i).val() == '') break;
			students.push($('#sname' + i).val());
			studentnums.push($('#snum' + i).val());
		}
		return students, studentnums;
	}

	function clearStatus() {
		$('button').removeAttr('disabled');
		$('select').removeAttr('disabled');
		$('input').removeAttr('readonly');
		$('textarea').removeAttr('readonly');
	}

	$('.pageloader .title').text('Loading Dashboard');
	$('#thesis').addClass('is-active');
	BulmaTagsInput.attach('input[data-type="tags"], input[type="tags"]');
	responsiveViewport();
	
	$(window).resize(function() {
		responsiveViewport();
	});

	$('#add').click(function() {
		$('.modal').addClass('is-active');
		$('html').addClass('is-clipped');
		$('.modal-card-title').text('Add Proposal');
		$('.modal input').val('');
		$('textarea').val('');
	});

	$('.delete').click(function() {
		$('.modal').removeClass('is-active');
		$('html').removeClass('is-clipped');
	});

	$('#cancel').click(function() {
		$('.modal').removeClass('is-active');
		$('html').removeClass('is-clipped');
	});

	$('.sn').keyup(function() {
		if ($(this).val().length > 11) $(this).val($(this).val().slice(0, 11));
	});

	$('#proposal').submit(function(e) {
		e.preventDefault();
		$('button').attr('disabled', true);
		$('select').attr('disabled', true);
		$('input').attr('readonly', true);
		$('textarea').attr('readonly', true);
		$('#submit').addClass('is-loading').removeAttr('disabled');
		let program = $('#program').val(), title = $('#title').val(), adviser = $('#adviser').val(), overview = $('#overview').val();
		var students = [], studentnums = [];
		students, studentnums = getStudentInfo(students, studentnums);
		let keywords = document.getElementById('keywords').BulmaTagsInput().value;
		$.ajax({
			type: 'POST',
			url: 'create/titles',
			data: {program:program, title:title, adviser:adviser, overview:overview, keywords:keywords, students:students, numbers:studentnums},
			datatype: 'JSON',
			success: function(response) {
				clearStatus();
				$('#submit').removeClass('is-loading');
				Swal.fire({
					icon: 'success',
					title: response.msg
				});
			},
			error: function(err) {
				console.log(err);
				clearStatus();
				$('#submit').removeClass('is-loading');
				Swal.fire({
					icon: 'error',
					title: 'Cannot Connect to Server',
					text: 'Something went wrong. Please try again later.'
				});
			}
		});
	});
});