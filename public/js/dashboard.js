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
			data: {data:'titles', search:search, tab:tab},
			datatype: 'JSON',
			success: function(data) {
				if (data.proposal.length == 0) {
					$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">No existing proposals.</div></div>');
				} else {
					for (let i in data.proposal) {
						let students = [];
						if (data.students) {
							for (let j in data.students) 
								if (data.students[j].title_id == data.proposal[i].id) students.push(data.students[j].name);
						}
						$('#contents').append(
							'<a class="box has-ribbon" data-id="' + data.proposal[i].id + '">' + addRibbon(data.proposal[i].program) +
							'<div class="columns">' +
							'<div class="column">' + 
							'<h3 class="title is-4">' + data.proposal[i].title + '</h3>' +
							'<h4 class="subtitle is-5">' + data.proposal[i].registration_id + '</h4>' +
							'<div class="tags">' + loadKeywords(data.proposal[i].keywords, data.proposal[i].area) + '</div>' +
							'</div></div></a>'
							);
						if (data.students) {
							$('#contents .box:last-child .tags').addClass('is-hidden-mobile');
							$('#contents .box:last-child .column').append(
								'<div class="tags">' + loadNames(data.proposal[i].adviser, students) + '</div>'
								);
							$('#contents .box:last-child .columns').append(
								'<div class="column is-2-desktop is-3-tablet">' + 
								'<div class="buttons">' +	
								'<button class="button edit" data-id="' + data.proposal[i].id + '" title="Edit ' + data.proposal[i].registration_id + '"><span class="icon"><i class="fas fa-edit"></i></span></button>' +
								'<button class="button is-danger is-inverted remove" data-id="' + data.proposal[i].id + '" title="Delete ' + data.proposal[i].registration_id + '"><span class="icon"><i class="fas fa-trash"></i></span></button>' +
								'</div></div>'
								);
						}
					}
				}
				$('#loading').addClass('is-hidden');
				$('#submit button').removeClass('is-loading');
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#submit button').removeClass('is-loading');
				$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve proposals. Try again later.</div></div>');
				ajaxError(err);
			}
		});
	}

	$('.pageloader .title').text('Loading Dashboard');
	$('#thesis').addClass('is-active');
	$('#loading').removeClass('is-hidden');
	var updateId, tab = 'all';
	loadProposals();
	BulmaTagsInput.attach('input[data-type="tags"], input[type="tags"]');
	responsiveViewport();
	
	$(window).resize(function() {
		responsiveViewport();
	});

	$('#add').click(function() {
		$('#edit').addClass('is-active');
		$('html').addClass('is-clipped');
		$('.modal-card-title').text('Add Proposal');
		$('.modal input').val('');
		$('textarea').val('');
		$('#program').val('BSCS');
		$('.si input').attr('required', true);
		$('#sname5').removeAttr('required');
		$('#snum5').removeAttr('required');
		$('.si').removeClass('is-hidden');
		$('#note').addClass('is-hidden');
		if ($('#submit span:nth-child(2)').text() == 'Update') $('#submit').empty().append('<span class="icon"><i class="fas fa-plus"></i></span><span>Add</span>');
		document.getElementById('keywords').BulmaTagsInput().flush();
	});

	$('.delete').click(function() {
		if ($('#view').hasClass('is-active')) {
			$('#view').removeClass('is-active');
			$('html').removeClass('is-clipped');
		}
		if (!$('#submit').hasClass('is-loading')) {
			$('#edit').removeClass('is-active');
			$('html').removeClass('is-clipped');
		}
	});

	$('#cancel').click(function() {
		if (!$('#submit').hasClass('is-loading'))  {
			$('#edit').removeClass('is-active');
			$('html').removeClass('is-clipped');
		}
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
		var program = $('#program').val(), title = $('#title').val(), adviser = $('#adviser').val(), overview = $('#overview').val(), area = $('#area').val();
		var keywords = document.getElementById('keywords').BulmaTagsInput().value;
		if ($('#submit span:nth-child(2)').text() == 'Add') {
			var students = [], studentnums = [];
			students, studentnums = getStudentInfo(students, studentnums);
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
						$('#edit').removeClass('is-active');
						$('html').removeClass('is-clipped');
					});
				},
				error: function(err) {
					clearStatus();
					$('#submit').removeClass('is-loading');
					ajaxError(err);
				}
			});
		} else {
			$.ajax({
				type: 'POST',
				url: 'titles/' + updateId + '/update',
				data: {title:title, program:program, area:area, adviser:adviser, keywords:keywords, overview:overview},
				datatype: 'JSON',
				success: function(response) {
					clearStatus();
					$('#submit').removeClass('is-loading');
					Swal.fire({
						icon: 'success',
						title: 'Update Successful',
						text: response.msg,
						showConfirmButton: false,
						timer: 2500
					}).then(function() {
						loadProposals();
						$('#edit').removeClass('is-active');
						$('html').removeClass('is-clipped');
					});
				},
				error: function(err) {
					clearStatus();
					$('#submit').removeClass('is-loading');
					ajaxError(err);
				}
			});
		}
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
					text: 'Are you sure you want to delete ' + data.title + '?',
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
		$('.si').addClass('is-hidden');
		$('.si input').removeAttr('required');
		$('#note').removeClass('is-hidden');
		updateId = $(this).data('id');
		$.ajax({
			type: 'POST',
			url: 'titles/' + updateId + '/edit',
			datatype: 'JSON',
			success: function(data) {
				$('#program').val(data.program);
				$('#title').val(data.title);
				$('#area').val(data.area);
				$('#adviser').val(data.adviser);
				$('#overview').val(data.overview);
				document.getElementById('keywords').BulmaTagsInput().add(data.keywords);
				$('.modal-card-title').text('Edit Proposal');
				if ($('#submit span:nth-child(2)').text() == 'Add') $('#submit').empty().append('<span class="icon"><i class="fas fa-edit"></i></span><span>Update</span>');
				Swal.close();
				$('#edit').addClass('is-active');
				$('html').addClass('is-clipped');
			},
			error: function(err) {
				ajaxError(err);
			}
		});
	});

	$('body').delegate('#contents a.box', 'click', function() {
		let id = $(this).data('id');
		$('#view .field-body').empty();
		Swal.fire({
			html: '<span class="icon is-large"><i class="fas fa-spinner fa-spin fa-2x"></i></span>',
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false
		});
		$.ajax({
			type: 'POST',
			url: 'titles/' + id,
			data: {data:'view'},
			datatype: 'JSON',
			success: function(data) {
				if (data.status == 'denied') {
					Swal.fire({
						icon: 'error',
						title: 'Access Denied',
						text: data.msg
					});
				} else {
					let sistring = keystring = '', keywords = data.proposal.keywords.split(',');
					for (let i in keywords)
						keystring += '<span class="tag is-info is-light">' + keywords[i] + '</span>';
					for (let i in data.students)
						sistring += '<span class="tag is-info is-light">' + data.students[i].name + '</span>';
					$('#vprogram').text(data.proposal.program);
					$('#vtitle').text(data.proposal.title);
					$('#varea').text(data.proposal.area);
					$('#vsi').append('<div class="tags are-medium">' + sistring + '</div>');
					$('#vadviser').text(data.proposal.adviser);
					$('#vkeywords').append('<div class="tags are-medium">' + keystring + '</div>');
					$('#voverview').text(data.proposal.overview);
					Swal.close();
					$('#view').addClass('is-active');
					$('html').addClass('is-clipped');
				}
			},
			error: function(err) {
				ajaxError(err);
			}
		});
	});

	$('#myp').click(function() {
		if ($('#thesis').hasClass('is-active')) {
			tab = 'per', search = '';
			$('#search input').val('');
			$(this).addClass('is-active');
			$('#thesis').removeClass('is-active');
			loadProposals();
		}
	});

	$('#thesis').click(function() {
		if ($('#myp').hasClass('is-active')) {
			tab = 'all', search = '';
			$('#search input').val('');
			$(this).addClass('is-active');
			$('#myp').removeClass('is-active');
			loadProposals();
		}
	});

	$('#search').submit(function(e) {
		e.preventDefault();
		if (tab = 'per') {
			$('#thesis').addClass('is-active');
			$('#myp').removeClass('is-active');
		}
		$('#search button').addClass('is-loading');
		tab = 'all', search = $('#search input').val();
		loadProposals();
	});
});