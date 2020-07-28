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

	function loadKeywords(keystring, area) {
		let tags = '<span class="tag is-dark">' + area + '</span>', keywords = keystring.split(',');
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

	function addRibbon(program) {
		let ribbon;
		switch(program) {
			case 'BSCS':
			ribbon = '<div class="ribbon is-success">BSCS</div>';
			break;

			case 'BSIT':
			ribbon = '<div class="ribbon is-info">BSIT</div>';
			break;

			case 'BSEMCDA':
			ribbon = '<div class="ribbon is-danger">BSEMC-DA</div>';
			break;

			case 'BSEMCGD':
			ribbon = '<div class="ribbon is-warning">BSEMC-GD</div>';
			break;

			case 'BSIS':
			ribbon = '<div class="ribbon is-primary">BSIS</div>';
			break;
		}
		return ribbon;
	}

	function loadProposals() {
		$('#loading').removeClass('is-hidden');
		$('#contents .box').remove();
		$('.notif').remove();
		$.ajax({
			type: 'POST',
			url: 'titles',
			data: {data:'titles'},
			datatype: 'JSON',
			success: function(data) {
				if (data.proposal.length == 0) $('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">No existing proposals.</div></div>');
				for (let i in data.proposal) {
					let students = [];
					if (data.students.length > 0) {
						for (let j in data.students) 
							if (data.students[j].title_id == data.proposal[i].id) students.push(data.students[j].name);
					}

					$('#contents').append(
						'<a class="box has-ribbon">' + addRibbon(data.proposal[i].program) +
						'<div class="columns">' +
						'<div class="column">' + 
						'<h3 class="title is-4">' + data.proposal[i].title + '</h3>' +
						'<h4 class="subtitle is-5">' + data.proposal[i].registration_id + '</h4>' +
						'<div class="tags is-hidden-mobile">' + loadKeywords(data.proposal[i].keywords, data.proposal[i].area) + '</div>' +
						'<div class="tags">' + loadNames(data.proposal[i].adviser, students) + '</div>' +
						'</div><div class="column is-2-desktop is-3-tablet">' + 
						'<div class="buttons is-right">' +
						'<button class="button edit" data-id="' + data.proposal[i].id + '" title="Edit ' + data.proposal[i].registration_id + '"><span class="icon"><i class="fas fa-edit"></i></span></button>' +
						'<button class="button is-danger is-inverted remove" data-id="' + data.proposal[i].id + '" title="Delete ' + data.proposal[i].registration_id + '"><span class="icon"><i class="fas fa-trash"></i></span></button>' +
						'</div></div></div></a>'
						);
				}
				$('#loading').addClass('is-hidden');
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve proposals. Try again later.</div></div>');
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
		document.getElementById('keywords').BulmaTagsInput().flush();
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
		let program = $('#program').val(), title = $('#title').val(), adviser = $('#adviser').val(), overview = $('#overview').val(), area = $('#area').val();
		var students = [], studentnums = [];
		students, studentnums = getStudentInfo(students, studentnums);
		let keywords = document.getElementById('keywords').BulmaTagsInput().value;
		$.ajax({
			type: 'POST',
			url: 'titles/create',
			data: {program:program, title:title, area:area, adviser:adviser, overview:overview, keywords:keywords, students:students, numbers:studentnums},
			datatype: 'JSON',
			success: function(response) {
				clearStatus();
				$('#submit').removeClass('is-loading');
				Swal.fire({
					icon: 'success',
					title: response.msg,
					showConfirmButton: false,
					timer: 2500
				}).then(function() {
					loadProposals();
				});
				$('.modal').removeClass('is-active');
				$('html').removeClass('is-clipped');
			},
			error: function(err) {
				clearStatus();
				$('#submit').removeClass('is-loading');
				ajaxError(err);
			}
		});
	});

	$('#logout').submit(function() {
		$('.pageloader').addClass('is-active');
		$('.pageloader .title').text('Logging Out');
	});

	$('body').delegate('.remove', 'click', function() {
		Swal.fire({
			html: '<span class="icon is-large"><i class="fas fa-spin fa-spinner fa-2x"></i></span>',
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false
		});
		var id = $(this).data('id');
		$.ajax({
			type: 'POST',
			url: 'titles/' + id,
			datatype: 'JSON',
			success: function(data) {
				Swal.fire({
					icon: 'warning',
					title: 'Confirm Delete',
					text: 'Are you sure you want to delete ' + data.title,
					confirmButtonText: 'Yes',
					showCancelButton: true,
					cancelButtonText: 'No',
				}).then((result) => {
					if (result.value) {
						Swal.fire({
							title: 'Deleting Proposal',
							html: '<span class="icon is-large"><i class="fas fa-spin fa-spinner fa-2x"></i></span>',
							showConfirmButton: false,
							allowOutsideClick: false,
							allowEscapeKey: false
						});
						$.ajax({
							type: 'POST',
							url: 'titles/' + id + '/delete',
							datatype: 'JSON',
							success: function(response) {
								if (response.status == 'success') {
									Swal.fire({
										icon: 'success',
										title: 'Delete Successful',
										showConfirmButton: false,
										timer: 2500,
									}).then(function() {
										loadProposals();
									});
								}
							},
							error: function(err) {
								ajaxError(err);
							}
						});
					}
				});
			},
			error: function(err) {
				ajaxError(err);
			}
		});
	});

	$('body').delegate('.edit', 'click', function() {
		Swal.fire({
			html: '<span class="icon is-large"><i class="fas fa-spin fa-spinner fa-2x"></i></span>',
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false
		});
		var id = $(this).data('id');
		$.ajax({
			type: 'POST',
			url: 'titles/' + id,
			datatype: 'JSON',
			success: function(data) {
				Swal.close();
				$('#program option[value=' + data.proposal.program + ']').attr('selected', true);
				$('#title').val(data.proposal.title);
				$('#area').val(data.proposal.area);
				for (let i = 0; i < 5; i++) {
					$('#snum' + (i + 1)).val(data.students[i + 1].student_number);
				}
				$('.modal').addClass('is-active');
			},
			error: function(err) {
				ajaxError(err);
			}
		});
	});
});