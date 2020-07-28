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

	function ajaxError(err) {
		console.log(err);
		Swal.fire({
			icon: 'error',
			title: 'Cannot Connect to Server',
			text: 'Something went wrong. Please try again later.'
		});
	}

	function loadKeywords(keystring) {
		let tags = '', keywords = keystring.split(',');
		for (let i in keywords) {
			tags += '<span class="tag">' + keywords[i] + '</span>';
		}
		return tags;
	}

	function loadNames(adviser, students) {
		let tags = '<span class="tag is-info">' + adviser + '</span>';
		for (let i in students) {
			tags += '<span class="tag is-info is-light">' + students[i] + '</span>';
		}
		return tags;
	}

	function loadProposals() {
		$('#loading').removeClass('is-hidden');
		$.ajax({
			type: 'POST',
			url: 'titles',
			data: {data:'titles'},
			datatype: 'JSON',
			success: function(data) {
				for (let i in data.proposal) {
					let students = [];
					for (let j in data.students) 
						if (data.students[j].title_id == data.proposal[i].id) students.push(data.students[j].name);
					$('#contents').append(
						'<a class="box">' +
						'<div class="columns">' +
						'<div class="column">' + 
						'<h3 class="title is-4">' + data.proposal[i].title + '</h3>' +
						'<h4 class="subtitle is-5">' + data.proposal[i].registration_id + '</h4>' +
						'<div class="tags is-hidden-mobile">' + loadKeywords(data.proposal[i].keywords) + '</div>' +
						'<div class="tags">' + loadNames(data.proposal[i].adviser, students) + '</div>' +
						'</div><div class="column is-2-desktop is-3-tablet">' +
						'<div class="buttons is-right">' +
						'<button class="button" title="Edit ' + data.proposal[i].registration_id + '"><span class="icon"><i class="fas fa-edit"></i></span></button>' +
						'<button class="button is-danger is-inverted" title="Delete ' + data.proposal[i].registration_id + '"><span class="icon"><i class="fas fa-trash"></i></span></button>' +
						'</div></div></div></a>'
						);
				}
				$('#loading').addClass('is-hidden');
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#contents').append('<div class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve proposals.</div></div>');
				ajaxError(err);
			}
		});
	}

	$('.pageloader .title').text('Loading Dashboard');
	$('#thesis').addClass('is-active');
	loadProposals();
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
			url: 'titles/create',
			data: {program:program, title:title, adviser:adviser, overview:overview, keywords:keywords, students:students, numbers:studentnums},
			datatype: 'JSON',
			success: function(response) {
				clearStatus();
				$('#submit').removeClass('is-loading');
				Swal.fire({
					icon: 'success',
					title: response.msg
				});
				loadProposals();
				$('.modal').removeClass('is-active');
			},
			error: function(err) {
				clearStatus();
				$('#submit').removeClass('is-loading');
				ajaxError(err);
			}
		});
	});
});