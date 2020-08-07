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

	function getStudentInfo(studentnums) {
		for (let i = 1; i < 6; i++) {
			if ($('#sname' + i).val() == '' || $('#snum' + i).val() == '') break;
			studentnums.push($('#snum' + i).val());
		}
		return studentnums;
	}

	function clearStatus() {
		$('button').removeAttr('disabled');
		$('select').removeAttr('disabled');
		$('input').removeAttr('readonly');
		$('textarea').removeAttr('readonly');
		$('#edit_user button.is-fullwidth').attr('disabled', true);
		$('#clear').attr('disabled', true);
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

	function formatDate(date) {
		let hours = date.getHours(), minutes = date.getMinutes(), ampm = hours >= 12 ? 'pm' : 'am';
		hours %= 12;
		hours = hours ? hours : 12;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		let strTime = hours + ':' + minutes + ' ' + ampm;
		return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' - ' + strTime;
	}

	function retrieveProposals() {
		$('#loading').removeClass('is-hidden');
		$('#contents .box').remove();
		$('.table-container').remove();
		$('.notif').remove();
		$.ajax({
			type: 'POST',
			url: 'titles',
			data: {data:'titles', search:search, tab:tab},
			datatype: 'JSON',
			success: function(data) {
				if (data.proposals.length == 0) {
					$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">No existing proposals.</div></div>');
				} else {
					for (let i in data.proposals) {
						$('#contents').append(
							'<a class="box has-ribbon" data-id="' + data.proposals[i].id + '">' + addRibbon(data.proposals[i].program) +
							'<div class="columns">' +
							'<div class="column">' +
							'<h3 class="title is-4">' + data.proposals[i].title + '</h3>' +
							'<h4 class="subtitle is-5">' + data.proposals[i].registration_id + '</h4>' +
							'<div class="tags">' + loadKeywords(data.proposals[i].keywords, data.proposals[i].area) + '</div>' +
							'</div></div></a>'
							);
						if (data.proposals[i].students) {
							$('#contents .box:last-child .tags').addClass('is-hidden-mobile');
							$('#contents .box:last-child .column').append(
								'<div class="tags">' + loadNames(data.proposals[i].adviser, data.proposals[i].students) + '</div>'
								);
							$('#contents .box:last-child .columns').append(
								'<div class="column is-2-desktop is-3-tablet">' +
								'<div class="buttons">' +
								'<button class="button edit" data-id="' + data.proposals[i].id + '" title="Edit ' + data.proposals[i].registration_id + '"><span class="icon"><i class="fas fa-edit"></i></span></button>' +
								'<button class="button is-danger is-inverted remove" data-id="' + data.proposals[i].id + '" title="Delete ' + data.proposals[i].registration_id + '"><span class="icon"><i class="fas fa-trash"></i></span></button>' +
								'</div></div>'
								);
						}
					}
				}
				$('#loading').addClass('is-hidden');
				$('#search button').removeClass('is-loading');
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#search button').removeClass('is-loading');
				$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve proposals. Try again later.</div></div>');
				ajaxError(err);
			}
		});
	}

	function retrieveLogs() {
		$('#loading').removeClass('is-hidden');
		$('#contents .box').remove();
		$('.table-container').remove();
		$('.notif').remove();
		$.ajax({
			type: 'POST',
			url: 'logs',
			data: {search:search},
			datatype: 'JSON',
			success: function(data) {
				$('#search button').removeClass('is-loading');
				$('#loading').addClass('is-hidden');
				$('#contents').append('<div id="logs_table" class="table-container"><table class="table is-fullwidth"><tr><th>Log ID</th><th>Description</th><th>Date & Time</th></tr></table></div>');
				if (data.length > 0) {
					for (i in data) {
						let timestamp = new Date(data[i].created_at);
						$('table').append('<tr><td>' + data[i].id + '</td><td>' + data[i].description + '</td><td>' + formatDate(timestamp) + '</td></tr>');
					}
				} else {
					$('table').append('<tr><td colspan="3" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">No existing logs.</div></td></tr>');
				}
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#search button').removeClass('is-loading');
				$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve logs. Try again later.</div></div>');
				ajaxError(err);
			}
		});
	}

	function retrieveStudents() {
		$('#loading').removeClass('is-hidden');
		$('#contents .box').remove();
		$('.table-container').remove();
		$('.notif').remove();
		$.ajax({
			type: 'POST',
			url: 'users',
			data: {data:'students', search:search},
			datatype: 'JSON',
			success: function(data) {
				$('#search button').removeClass('is-loading');
				$('#loading').addClass('is-hidden');
				$('#contents').append('<div id="stud_table" class="table-container"><table class="table is-fullwidth"><tr><th>Student Number</th><th>Name</th><th>Actions</th></tr></table></div>');
				if (data.length > 0) {
					for (i in data)
						$('table').append('<tr><td>' + data[i].student_number + '</td><td>' + data[i].name + '</td><td><div class="buttons is-right"><button class="button studedit" data-id="' + data[i].id + '" title="Edit ' + data[i].name + '"><span class="icon"><i class="fas fa-edit"></i></span></button><button class="button is-danger is-inverted studremove" data-id="' + data[i].id + '" title="Remove ' + data[i].name + '"><span class="icon"><i class="fas fa-trash"></i></span></button></div></td></tr>');
				} else {
					$('table').append('<tr><td colspan="3" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">No students registered.</div></td></tr>');
				}
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#search button').removeClass('is-loading');
				$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve students. Try again later.</div></div>');
				ajaxError(err);
			}
		});
	}

	function retrieveAdvisers() {
		$('#loading').removeClass('is-hidden');
		$('#contents .box').remove();
		$('.table-container').remove();
		$('.notif').remove();
		$.ajax({
			type: 'POST',
			url: 'users',
			data: {data:'advisers', search:search},
			datatype: 'JSON',
			success: function(data) {
				$('#search button').removeClass('is-loading');
				$('#loading').addClass('is-hidden');
				$('#contents').append('<div id="stud_table" class="table-container"><table class="table is-fullwidth"><tr><th>ID Number</th><th>Name</th><th>Actions</th></tr></table></div>');
				if (data.length > 0) {
					for (i in data)
						$('table').append('<tr><td>' + data[i].student_number + '</td><td>' + data[i].name + '</td><td><div class="buttons is-right"><button class="button studedit" data-id="' + data[i].id + '" title="Edit ' + data[i].name + '"><span class="icon"><i class="fas fa-edit"></i></span></button><button class="button is-danger is-inverted studremove" data-id="' + data[i].id + '" title="Remove ' + data[i].name + '"><span class="icon"><i class="fas fa-trash"></i></span></button></div></td></tr>');
				} else {
					$('table').append('<tr><td colspan="3" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">No advisers registered.</div></td></tr>');
				}
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#search button').removeClass('is-loading');
				$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve advisers. Try again later.</div></div>');
				ajaxError(err);
			}
		});
	}

	$('.pageloader .title').text('Loading Dashboard');
	$('#thesis').addClass('is-active');
	$('#loading').removeClass('is-hidden');
	var updateId, check, search = '', tab = 'all';
	retrieveProposals();
	BulmaTagsInput.attach('input[data-type="tags"], input[type="tags"]');
	responsiveViewport();
	$(window).resize(function() {
		responsiveViewport();
	});

	$('#add').click(function() {
		if ($('#loading').hasClass('is-hidden')) {
			if ($('#thesis').hasClass('is-active')) {
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
			} else if ($('#students').hasClass('is-active') || $('#advisers').hasClass('is-active')) {
				$('#edit_user .help').remove();
				$('#sn').removeClass('is-danger').removeClass('is-success');
				$('#submit_user').removeAttr('disabled');
				$('#edit_user').addClass('is-active');
				$('html').addClass('is-clipped');
				if ($('#students').hasClass('is-active')) {
					$('.modal-card-title').text('Add Student');
					$('#edit_user .subtitle').text('Add an Individual Student');
					$('#user_label').text('Student Number');
				} else {
					$('.modal-card-title').text('Add Adviser');
					$('#edit_user .subtitle').text('Add an Individual Adviser');
					$('#user_label').text('ID Number');
				}
				$('.modal input').val('');
				if ($('#submit_user span:nth-child(2)').text() == 'Update') $('#submit_user').empty().append('<span class="icon"><i class="fas fa-plus"></i></span><span>Add</span>');
			}
		}
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
		if (!$('#submit_user').hasClass('is-loading') && !$('#sncontrol').hasClass('is-loading')) {
			$('#edit_user').removeClass('is-active');
			$('html').removeClass('is-clipped');
		}
	});

	$('.cancel').click(function() {
		if (!$('#submit').hasClass('is-loading'))  {
			$('#edit').removeClass('is-active');
			$('html').removeClass('is-clipped');
		}
		if (!$('#submit_user').hasClass('is-loading') && !$('#sncontrol').hasClass('is-loading')) {
			$('#edit_user').removeClass('is-active');
			$('html').removeClass('is-clipped');
		}
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
			var studentnums = [];
			studentnums = getStudentInfo(studentnums);
			$.ajax({
				type: 'POST',
				url: 'titles/create',
				data: {program:program, title:title, area:area, adviser:adviser, overview:overview, keywords:keywords, numbers:studentnums},
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
						retrieveProposals();
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
						retrieveProposals();
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
		check = this;
		$(this).addClass('is-loading');
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
										retrieveProposals();
										$(check).removeClass('is-loading');
									});
								}
							},
							error: function(err) {
								ajaxError(err);
								$(check).removeClass('is-loading');
							}
						});
					}
				});
			},
			error: function(err) {
				ajaxError(err);
				$(check).removeClass('is-loading');
			}
		});
	});

	$('body').delegate('.edit', 'click', function() {
		var button = this;
		$(this).addClass('is-loading');
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
				$('#edit .modal-card-title').text('Edit Proposal');
				if ($('#submit span:nth-child(2)').text() == 'Add') $('#submit').empty().append('<span class="icon"><i class="fas fa-edit"></i></span><span>Update</span>');
				Swal.close();
				$('#edit').addClass('is-active');
				$('html').addClass('is-clipped');
				$(button).removeClass('is-loading');
			},
			error: function(err) {
				ajaxError(err);
				$(button).removeClass('is-loading');
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
		window.setTimeout(function() {
			if (!$('#edit').hasClass('is-active') && !$(check).hasClass('is-loading')) {
				$.ajax({
					type: 'POST',
					url: 'titles/' + id,
					data: {data:'view'},
					datatype: 'JSON',
					success: function(data) {
						let sistring = keystring = '', keywords = data.proposal.keywords.split(',');
						for (let i in keywords)
							keystring += '<span class="tag is-info is-light">' + keywords[i] + '</span>';
						if (data.status != 'limited') {
							for (let i in data.students)
								sistring += '<span class="tag is-info is-light">' + data.students[i].name + '</span>';
							$('#vsi').append('<div class="tags are-medium">' + keystring + '</div>');
							$('#vadviser').text(data.proposal.adviser);
						} else {
							$('#vsi-label').addClass('is-hidden');
							$('#vadviser-label').addClass('is-hidden');
						}
						$('#vprogram').text(data.proposal.program);
						$('#vtitle').text(data.proposal.title);
						$('#varea').text(data.proposal.area);
						$('#vkeywords').append('<div class="tags are-medium">' + keystring + '</div>');
						$('#voverview').text(data.proposal.overview);
						Swal.close();
						$('#view').addClass('is-active');
						$('html').addClass('is-clipped');
					},
					error: function(err) {
						ajaxError(err);
					}
				});
			}
		}, 1000);
	});

	$('#myp').click(function() {
		if (!$(this).hasClass('is-active')) {
			if ($('#loading').hasClass('is-hidden')) {
				$('.tabs li').removeClass('is-active');
				$(this).addClass('is-active');
				$('#search input').val('');
				tab = 'myp', search = '';
				retrieveProposals();
			}
		}
	});

	$('#thesis').click(function() {
		if (!$(this).hasClass('is-active')) {
			if ($('#loading').hasClass('is-hidden')) {
				$('.tabs li').removeClass('is-active');
				$(this).addClass('is-active');
				$('.column:nth-child(2)').removeClass('is-hidden');
				$('#add span:nth-child(2)').text('Add Proposal');
				$('#logout').removeClass('is-hidden');
				$('#search input').val('').attr('placeholder', 'Search title, keyword, or name...');
				tab = 'all', search = '';
				retrieveProposals();
			}
		}
	});

	$('#logs').click(function() {
		if (!$(this).hasClass('is-active')) {
			if ($('#loading').hasClass('is-hidden')) {
				$('.tabs li').removeClass('is-active');
				$(this).addClass('is-active');
				$('.column:nth-child(2)').addClass('is-hidden');
				$('#logout').removeClass('is-hidden');
				$('#search input').val('').attr('placeholder', 'Search description, date, or time...');
				search = '';
				retrieveLogs();
			}
		}
	});

	$('#students').click(function() {
		if (!$(this).hasClass('is-active')) {
			if ($('#loading').hasClass('is-hidden')) {
				$('.tabs li').removeClass('is-active');
				$(this).addClass('is-active');
				$('.column:nth-child(2)').removeClass('is-hidden');
				$('#add span:nth-child(2)').text('Add Student');
				$('#search input').val('').attr('placeholder', 'Search name or student number...');
				$('#sn').attr('placeholder', 'XXXXXXXXXXX');
				search = '';
				retrieveStudents();
			}
		}
	});

	$('#advisers').click(function() {
		if (!$(this).hasClass('is-active')) {
			if ($('#loading').hasClass('is-hidden')) {
				$('.tabs li').removeClass('is-active');
				$(this).addClass('is-active');
				$('.column:nth-child(2)').removeClass('is-hidden');
				$('#add span:nth-child(2)').text('Add Adviser');
				$('#search input').val('').attr('placeholder', 'Search name or number...');
				$('#sn').attr('placeholder', 'XXXXX');
				search = '';
				retrieveAdvisers();
			}
		}
	});

	$('#search input').keyup(function() {
		$(this).val() != '' ? $('#clear').removeAttr('disabled') : $('#clear').attr('disabled', true);
	});

	$('#search').submit(function(e) {
		e.preventDefault();
		if ($('#loading').hasClass('is-hidden')) {
			if (tab == 'myp') {
				$('#myp').removeClass('is-active');
				$('#thesis').addClass('is-active');
			}
			$('#search button[title="Search"]').addClass('is-loading');
			tab = 'all', search = $('#search input').val();
			if ($('#thesis').hasClass('is-active')) {
				retrieveProposals();
			} else if ($('#logs').hasClass('is-active')) {
				retrieveLogs();
			} else if ($('#students').hasClass('is-active')) {
				retrieveStudents();
			} else if ($('#advisers').hasClass('is-active')) {
				retrieveAdvisers();
			}
		}	
	});

	$('#clear').click(function() {
		if ($('#loading').hasClass('is-hidden')) {
			$('#search input').val('');
			$(this).attr('disabled', true);
			tab = 'all', search = '';
			if ($('#thesis').hasClass('is-active')) {
				retrieveProposals();
			} else if ($('#logs').hasClass('is-active')) {
				retrieveLogs();
			} else if ($('#students').hasClass('is-active')) {
				retrieveStudents();
			} else if ($('#advisers').hasClass('is-active')) {
				retrieveAdvisers();
			}
		}
	});

	$('#user_form').submit(function(e) {
		e.preventDefault();
		$('input').attr('readonly', true);
		$('button').attr('disabled', true);
		$('#submit_user').addClass('is-loading').removeAttr('disabled');
		var number = $('#sn').val(), name = $('#name').val(), user = $('#students').hasClass('is-active') ? 'STUDENT' : 'ADVISER';
		$.ajax({
			type: 'POST',
			url: 'users/create',
			data: {type:user, student_number:number, name:name},
			datatype: 'JSON',
			success: function(response) {
				clearStatus();
				$('#submit_user').removeClass('is-loading');
				Swal.fire({
					icon: 'success',
					title: response.msg,
					showConfirmButton: false,
					timer: 2500
				}).then(function() {
					$('#edit_user').removeClass('is-active');
					$('html').removeClass('is-clipped');
					$('#students').hasClass('is-active') ? retrieveStudents() : retrieveAdvisers();
				});
			},
			error: function(err) {
				clearStatus();
				$('#submit_user').removeClass('is-loading');
				ajaxError(err);
			}
		});
	});

	$('#sn').keyup(function() {
		if (!$('#sncontrol').hasClass('is-loading')) {
			$(this).removeClass('is-success').removeClass('is-danger');
			$('#edit_user .help').remove();
			$('#submit_user').removeAttr('disabled');
			if ($('#students').hasClass('is-active')) {
				if ($(this).val().length > 11) $(this).val($(this).val().slice(0, 11));
				if ($(this).val().length == 11) {
					$('#sncontrol').addClass('is-loading');
					$(this).attr('readonly', true);
					$('button').attr('disabled', true);
					let sn = $(this).val();
					$.ajax({
						type: 'POST',
						url: 'users/check',
						data: {student_number:sn, type:'STUDENT'},
						datatype: 'JSON',
						success: function(response) {
							$('#sncontrol').removeClass('is-loading');
							if (response.status == 'success') {
								clearStatus();
								$('#sn').addClass('is-success').removeAttr('readonly');
							} else {
								clearStatus();
								$('#sn').addClass('is-danger');
								$('#sncontrol').append('<div class="help is-danger">' + response.msg + '</div>')
								$('#submit_user').attr('disabled', true);
							}
						},
						error: function(err) {
							clearStatus();
							$('#sncontrol').removeClass('is-loading');
							$('#sn').removeAttr('disabled');
							ajaxError(err);
						}
					});
				}
			} else {
				if ($(this).val().length > 5) $(this).val($(this).val().slice(0, 5));
				if ($(this).val().length == 5) {
					$('#sncontrol').addClass('is-loading');
					$(this).attr('readonly', true);
					$('button').attr('disabled', true);
					let sn = $(this).val();
					$.ajax({
						type: 'POST',
						url: 'users/check',
						data: {student_number:sn, type:'ADVISER'},
						datatype: 'JSON',
						success: function(response) {
							$('#sncontrol').removeClass('is-loading');
							if (response.status == 'success') {
								clearStatus();
								$('#sn').addClass('is-success').removeAttr('readonly');
							} else {
								clearStatus();
								$('#sn').addClass('is-danger');
								$('#sncontrol').append('<div class="help is-danger">' + response.msg + '</div>')
								$('#submit_user').attr('disabled', true);
							}
						},
						error: function(err) {
							clearStatus();
							$('#sncontrol').removeClass('is-loading');
							$('#sn').removeAttr('disabled');
							ajaxError(err);
						}
					});
				}
			}
		}
	});
});
