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
		$('.name').attr('readonly', true);
		if ($('#search input').val() == '') $('#clear').attr('disabled', true);
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
		let tags = '', keywords = keystring.split(',');
		if (area != null && area != '')
			tags = '<span class="tag is-dark">' + area + '</span>';
		if (keystring != null && keystring != '') {
			for (let i in keywords) {
				tags += '<span class="tag">' + keywords[i] + '</span>';
			}
		}
		return tags;
	}

	function loadNames(adviser, students) {
		let tags = '<span class="tag is-info">' + adviser + '</span>';
		for (let i in students) {
			tags += '<span class="tag is-info is-light">' + students[i].name + '</span>';
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

	function pagination(current, prev, next, last, lastpage) {
		$('#body').append('<nav class="pagination is-right"></nav>');
		if (prev != null) $('.pagination').append('<a class="pagination-previous" data-url="' + prev + '">Previous</a>');
		if (next != null) $('.pagination').append('<a class="pagination-next" data-url="' + next + '">Next</a>');
		if (lastpage >= 3) $('.pagination').append('<form class="pagination-list"><div class="field has-addons"><div class="control"><button id="goto" class="button is-info" type="submit">Go to</button></div><div id="page" class="control"><input type="number" class="input" min="1" max="' + lastpage + '" value="' + current + '" placeholder="Page #"></div><div class="control"><a class="button is-static">/ ' + lastpage + '</a></div></div></form>');
	}

	function retrieveProposals() {
		$('#loading').removeClass('is-hidden');
		$('#contents .box').remove();
		$('.table-container').remove();
		$('.pagination').remove();
		$('.notif').remove();
		$('#contents .subtitle.is-5').remove();
		$.ajax({
			type: 'POST',
			url: link,
			data: {data:'titles', search:search, tab:tab},
			datatype: 'JSON',
			success: function(data) {
				$('#contents').append('<div class="subtitle is-5">Results: ' + data.proposals.total + '</div>');
				if (data.proposals.total == 0) {
					$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">No existing proposals.</div></div>');
				} else {
					for (let i in data.proposals.data) {
						let proposal = '<a class="box has-ribbon" data-id="' + data.proposals.data[i].id + '">' + addRibbon(data.proposals.data[i].program);
						proposal += '<div class="columns"><div class="column">';
						proposal += '<h3 class="title is-4">' + data.proposals.data[i].title + '</h3>';
						if (data.proposals.data[i].registration_id) proposal += '<h4 class="subtitle is-5">' + data.proposals.data[i].registration_id + '</h4>';
						proposal += '<div class="tags">' + loadKeywords(data.proposals.data[i].keywords, data.proposals.data[i].area) + '</div>';
						if (data.proposals.data[i].students) proposal += '<div class="tags">' + loadNames(data.proposals.data[i].adviser, data.proposals.data[i].students) + '</div>';
						if (data.proposals.data[i].edit) {
							proposal += '</div><div class="column is-2-desktopn is-3-tablet">';
							proposal += '<div class="buttons is-right">';
							proposal += '<button class="button edit" data-id="' + data.proposals.data[i].id + '" title="Edit ' + data.proposals.data[i].registration_id + '"><span class="icon"><i class="fas fa-edit"></i></span></button>';
							proposal += '<button class="button is-danger is-inverted remove" data-id="' + data.proposals.data[i].id + '" title="Remove ' + data.proposals.data[i].registration_id + '"><span class="icon"><i class="fas fa-trash"></i></span></button>';
							proposal += '</div>';
						}
						proposal += '</div></div></a>';
						$('#contents').append(proposal);
					}
					if (data.proposals.last_page > 1) {
						currentPage = data.proposals.current_page, prevPage = data.proposals.prev_page_url, nextPage = data.proposals.next_page_url, lastPage = data.proposals.last_page_url;
						pagination(currentPage, prevPage, nextPage, lastPage, data.proposals.last_page);
					}
				}
				$('#loading').addClass('is-hidden');
				$('#search button').removeClass('is-loading');
				if (pending == true) {
					pending = false;
					retrieveProposals();
				} else {
					request = false;
				}
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#search button').removeClass('is-loading');
				$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve proposals. Try again later.</div></div>');
				ajaxError(err);
				if (pending == true) {
					pending = false;
					retrieveProposals();
				} else {
					request = false;
				}
			}
		});
	}

	function retrieveLogs() {
		$('#loading').removeClass('is-hidden');
		$('#contents .box').remove();
		$('.table-container').remove();
		$('.pagination').remove();
		$('.notif').remove();
		$('#contents .subtitle.is-5').remove();
		$.ajax({
			type: 'POST',
			url: link,
			data: {search:search},
			datatype: 'JSON',
			success: function(data) {
				$('#search button').removeClass('is-loading');
				$('#loading').addClass('is-hidden');
				$('#contents').append('<div class="subtitle is-5">Results: ' + data.total + '</div>');
				$('#contents').append('<div id="logs_table" class="table-container"><table class="table is-fullwidth"><tr><th>Log ID</th><th>Description</th><th>Date & Time</th></tr></table></div>');
				if (data.total > 0) {
					for (i in data.data) {
						let timestamp = new Date(data.data[i].created_at);
						$('table').append('<tr><td>' + data.data[i].id + '</td><td>' + data.data[i].description + '</td><td>' + formatDate(timestamp) + '</td></tr>');
					}
					if (data.last_page > 1) {
						currentPage = data.current_page, prevPage = data.prev_page_url, nextPage = data.next_page_url, lastPage = data.last_page_url;
						pagination(currentPage, prevPage, nextPage, lastPage, data.last_page);
					}
				} else {
					$('table').append('<tr><td colspan="3" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">No existing logs.</div></td></tr>');
				}
				if (pending == true) {
					pending = false;
					retrieveProposals();
				} else {
					request = false;
				}
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#search button').removeClass('is-loading');
				$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve logs. Try again later.</div></div>');
				ajaxError(err);
				if (pending == true) {
					pending = false;
					retrieveProposals();
				} else {
					request = false;
				}
			}
		});
	}

	function retrieveStudents() {
		$('#loading').removeClass('is-hidden');
		$('#contents .box').remove();
		$('.table-container').remove();
		$('.pagination').remove();
		$('.notif').remove();
		$('#contents .subtitle.is-5').remove();
		$.ajax({
			type: 'POST',
			url: link,
			data: {data:'students', search:search},
			datatype: 'JSON',
			success: function(data) {
				$('#search button').removeClass('is-loading');
				$('#loading').addClass('is-hidden');
				$('#contents').append('<div class="subtitle is-5">Results: ' + data.total + '</div>');
				$('#contents').append('<div id="stud_table" class="table-container"><table class="table is-fullwidth"><tr><th>Student Number</th><th>Name</th><th>Actions</th></tr></table></div>');
				if (data.total > 0) {
					for (i in data.data)
						$('table').append('<tr><td>●●●●●●●●●●●</td><td>' + data.data[i].name + '</td><td><div class="buttons is-right"><button class="button studedit" data-id="' + data.data[i].id + '" title="Edit ' + data.data[i].name + '"><span class="icon"><i class="fas fa-edit"></i></span></button><button class="button is-danger is-inverted studremove" data-id="' + data.data[i].id + '" title="Remove ' + data.data[i].name + '"><span class="icon"><i class="fas fa-trash"></i></span></button></div></td></tr>');
					if (data.last_page > 1) {
						currentPage = data.current_page, prevPage = data.prev_page_url, nextPage = data.next_page_url, lastPage = data.last_page_url;
						pagination(currentPage, prevPage, nextPage, lastPage, data.last_page);
					}
				} else {
					$('table').append('<tr><td colspan="3" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">No students registered.</div></td></tr>');
				}
				if (pending == true) {
					pending = false;
					retrieveProposals();
				} else {
					request = false;
				}
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#search button').removeClass('is-loading');
				$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve students. Try again later.</div></div>');
				ajaxError(err);
				if (pending == true) {
					pending = false;
					retrieveProposals();
				} else {
					request = false;
				}
			}
		});
	}

	function retrieveAdvisers() {
		$('#loading').removeClass('is-hidden');
		$('#contents .box').remove();
		$('.table-container').remove();
		$('.pagination').remove();
		$('.notif').remove();
		$('#contents .subtitle.is-5').remove();
		$.ajax({
			type: 'POST',
			url: link,
			data: {data:'advisers', search:search},
			datatype: 'JSON',
			success: function(data) {
				$('#search button').removeClass('is-loading');
				$('#loading').addClass('is-hidden');
				$('#contents').append('<div class="subtitle is-5">Results: ' + data.total + '</div>');
				$('#contents').append('<div id="stud_table" class="table-container"><table class="table is-fullwidth"><tr><th>ID Number</th><th>Name</th><th>Actions</th></tr></table></div>');
				if (data.total > 0) {
					for (i in data.data)
						$('table').append('<tr><td>●●●●●●●</td><td>' + data.data[i].name + '</td><td><div class="buttons is-right"><button class="button studedit" data-id="' + data.data[i].id + '" title="Edit ' + data.data[i].name + '"><span class="icon"><i class="fas fa-edit"></i></span></button><button class="button is-danger is-inverted studremove" data-id="' + data.data[i].id + '" title="Remove ' + data.data[i].name + '"><span class="icon"><i class="fas fa-trash"></i></span></button></div></td></tr>');
					if (data.last_page > 1) {
						currentPage = data.current_page, prevPage = data.prev_page_url, nextPage = data.next_page_url, lastPage = data.last_page_url;
						pagination(currentPage, prevPage, nextPage, lastPage, data.last_page);
					}
				} else {
					$('table').append('<tr><td colspan="3" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">No advisers registered.</div></td></tr>');
				}
				if (pending == true) {
					pending = false;
					retrieveProposals();
				} else {
					request = false;
				}
			},
			error: function(err) {
				$('#loading').addClass('is-hidden');
				$('#search button').removeClass('is-loading');
				$('#contents').append('<div class="has-text-centered notif"><span class="icon"><i class="fas fa-exclamation-circle"></i></span><div class="subtitle is-6">Cannot retrieve advisers. Try again later.</div></div>');
				ajaxError(err);
				if (pending == true) {
					pending = false;
					retrieveProposals();
				} else {
					request = false;
				}
			}
		});
	}

	function sn_proposalCheck() {
		for (let i in sn_error) {
			if (sn_error[i] == true) {
				$('#submit').attr('disabled', true);
				break;
			}
		}
	}

	function delay(fn, ms) {
		let timer = 0
		return function(...args) {
			clearTimeout(timer)
			timer = setTimeout(fn.bind(this, ...args), ms || 0)
		}
	}

	$('.pageloader .title').text('Loading Dashboard');
	$('#thesis').addClass('is-active');
	$('#loading').removeClass('is-hidden');
	var updateId, dlfile, check, currentPage, prevPage, nextPage, lastPage, event = '', editsn, editid, search = '', tab = 'all', link = 'titles', request = false, pending = false;
	var sn_error = {snum1:false, snum2:false, snum3:false, snum4:false, snum5:false, title:false};
	retrieveProposals();
	BulmaTagsInput.attach('input[data-type="tags"], input[type="tags"]');
	responsiveViewport();
	$(window).resize(function() {
		responsiveViewport();
	});

	$('#add').click(function() {
		if ($('#loading').hasClass('is-hidden')) {
			if ($('#thesis').hasClass('is-active')) {
				$('#thesis_note').addClass('is-hidden');
				$('#edit .select').removeClass('is-hidden');
				$('#submit').removeAttr('disabled');
				$('.name').attr('readonly', true);
				$('input').removeClass('is-danger').removeClass('is-success');
				$('#title_control .help').remove();
				$('#vfile-label').removeClass('is-hidden');
				$('.file-cta').css('width', 'fit-content');
				$('#file input').val('');
				$('.file-name').text('No file uploaded');
				if ($('#program option[value=""]').length == 0)
					$('#program').prepend('<option value="" selected disabled>Choose Program</option>');
				if ($('#status option[value=""]').length == 0)
					$('#status').prepend('<option value="" selected disabled>Choose Status</option>');
				$('#adviser').empty();
				Swal.fire({
					html: '<span class="icon is-large"><i class="fas fa-spin fa-spinner fa-2x"></i></span>',
					showConfirmButton: false,
					allowOutsideClick: false,
					allowEscapeKey: false
				});
				$.ajax({
					type: 'POST',
					url: 'users/validate',
					data: {data:'advisers'},
					datatype: 'JSON',
					success: function(data) {
						if (data.length > 0) {
							$('#adviser').append('<option value="" selected disabled>Choose Adviser</option>').attr('required', true);
							for (i in data) {
								$('#adviser').append('<option value="' + data[i].id + '">' + data[i].name + '</option>')
							}
						} else {
							$('#adviser_select').addClass('is-hidden');
							$('#thesis_note').removeClass('is-hidden');
							$('#submit').attr('disabled', true);
						}
						$('#edit').addClass('is-active');
						$('html').addClass('is-clipped');
						$('#edit .modal-card-title').text('Add Proposal');
						$('.modal input').val('');
						$('textarea').val('');
						$('#program').val('');
						$('#status').val('');
						$('#sname1').attr('required', true);
						$('#snum1').attr('required', true);
						$('.si').removeClass('is-hidden');
						$('#note').addClass('is-hidden');
						$('#submit').empty().append('<span class="icon"><i class="fas fa-plus"></i></span><span>Add</span>');
						document.getElementById('keywords').BulmaTagsInput().flush();
						Swal.close();
					},
					error: function(err) {
						ajaxError(err);
					}
				});
			} else if ($('#students').hasClass('is-active') || $('#advisers').hasClass('is-active')) {
				$('#edit_user .help').remove();
				$('#upload').removeClass('is-hidden');
				$('#edit_user .subtitle').removeClass('is-hidden');
				$('#sn').removeClass('is-danger').removeClass('is-success');
				$('#submit_user').removeAttr('disabled');
				$('#edit_user').addClass('is-active');
				$('html').addClass('is-clipped');
				if ($('#students').hasClass('is-active')) {
					$('#edit_user .modal-card-title').text('Add Student');
					$('#edit_user .subtitle').text('Add an Individual Student');
					$('#user_label').text('Student Number');
					$('#upload').removeClass('is-hidden').removeClass('is-loading');
					$('#sn_field').removeClass('is-hidden');
					$('#sn_field input').attr('required', true).removeClass('is-static').removeAttr('readonly').attr('required');
				} else {
					$('#edit_user .modal-card-title').text('Add Adviser');
					$('#edit_user .subtitle').text('Add an Individual Adviser');
					$('#user_label').text('ID Number');
					$('#upload').addClass('is-hidden');
					$('#sn_field').addClass('is-hidden');
					$('#sn_field input').removeAttr('required');
				}
				$('.modal input').val('');
				$('#submit_user').empty().append('<span class="icon"><i class="fas fa-plus"></i></span><span>Add</span>');
			}
		}
	});

	$('.delete').click(function() {
		if ($('#view').hasClass('is-active')) {
			$('#view').removeClass('is-active');
			$('html').removeClass('is-clipped');
		}
		if (!$('#submit').hasClass('is-loading') && !$('.control').hasClass('is-loading')) {
			$('#edit').removeClass('is-active');
			$('html').removeClass('is-clipped');
		}
		if (!$('#submit_user').hasClass('is-loading') && !$('.control').hasClass('is-loading')) {
			$('#edit_user').removeClass('is-active');
			$('html').removeClass('is-clipped');
		}
		$('#rnd_details').removeClass('is-active');
		$('html').removeClass('is-clipped');
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
		var data = new FormData($(this)[0]);
		data.append('program', $('#program').val());
		data.append('title', $('#title').val());
		data.append('adviser_id', $('#adviser').val());
		data.append('overview', $('#overview').val());
		data.append('area', $('#area').val());
		data.append('created_at', $('#date').val());
		data.append('status', $('#status').val());
		data.append('keywords', document.getElementById('keywords').BulmaTagsInput().value);
		data.append('file', $('#file input')[0].files[0]);
		if ($('#submit span:nth-child(2)').text() == 'Add') {
			var studentnums = [];
			data.append('numbers', getStudentInfo(studentnums));
			$.ajax({
				type: 'POST',
				url: 'titles/create',
				data: data,
				processData: false,
				contentType: false,
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
				data: data,
				processData: false,
				contentType: false,
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
		var button = this;
		event = 'Remove';
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
				$(button).removeClass('is-loading');
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
										event = '';
									});
								}
							},
							error: function(err) {
								ajaxError(err);
								event = '';
							}
						});
					}
				});
			},
			error: function(err) {
				ajaxError(err);
				event = '';
				$(button).removeClass('is-loading');
			}
		});
	});

	$('body').delegate('.edit', 'click', function() {
		var button = this;
		event = 'Edit';
		$(this).addClass('is-loading');
		Swal.fire({
			html: '<span class="icon is-large"><i class="fas fa-spin fa-spinner fa-2x"></i></span>',
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false
		});
		$('.si').addClass('is-hidden');
		$('#submit').removeAttr('disabled');
		$('.name').attr('readonly', true);
		$('.si input').removeAttr('required');
		$('#note').removeClass('is-hidden');
		$('#vfile-label').removeClass('is-hidden');
		$('#program option[value=""]').remove();
		$('#status option[value=""]').remove();
		$('#adviser').empty();
		$('#file input').val('');
		$('.file-name').text('Upload new file');
		updateId = $(this).data('id');
		$.ajax({
			type: 'POST',
			url: 'titles/' + updateId + '/edit',
			datatype: 'JSON',
			success: function(data) {
				event = '';
				let advisers = '', date = new Date(data.proposal.created_at);
				for (i in data.advisers)
					advisers += '<option value="' + data.advisers[i].id + '">' + data.advisers[i].name + '</option>'
				$('#program').val(data.proposal.program);
				$('#status').val(data.proposal.status);
				$('#title').val(data.proposal.title);
				$('#area').val(data.proposal.area);
				$('#adviser').append(advisers).val(data.proposal.adviser_id);
				$('#overview').val(data.proposal.overview);
				date = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + date.getDate();
				$('#date').val(date);
				if (data.proposal.keywords) document.getElementById('keywords').BulmaTagsInput().add(data.proposal.keywords);
				$('#edit .modal-card-title').text('Edit Proposal');
				$('#submit').empty().append('<span class="icon"><i class="fas fa-edit"></i></span><span>Update</span>');
				Swal.close();
				$('#edit').addClass('is-active');
				$('html').addClass('is-clipped');
				$(button).removeClass('is-loading');
			},
			error: function(err) {
				ajaxError(err);
				event = '';
				$(button).removeClass('is-loading');
			}
		});
	});

	$('body').delegate('#contents a.box', 'click', function() {
		if (event == '') {
			let id = $(this).data('id');
			$('#view .field-body').empty();
			$('#view .field').removeClass('is-hidden');
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
					let sistring = keystring = '', keywords = data.proposal.keywords.split(',');
					for (let i in keywords)
						keystring += '<span class="tag is-info is-light">' + keywords[i] + '</span>';
					if (data.proposal.students) {
						for (let i in data.proposal.students)
							sistring += '<span class="tag is-info is-light">' + data.proposal.students[i].name + '</span>';
						$('#vsi').append('<div class="tags are-medium">' + sistring + '</div>');
						$('#vadviser').text(data.proposal.adviser);
					} else {
						$('#vsi-label').addClass('is-hidden');
						$('#vadviser-label').addClass('is-hidden');
					}
					let date = new Date(data.proposal.created_at);
					$('#vdate').text((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
					$('#vprogram').text(data.proposal.program);
					$('#vstatus').text(data.proposal.status);
					$('#vtitle').text(data.proposal.title);
					$('#varea').text(data.proposal.area);
					$('#vkeywords').append('<div class="tags are-medium">' + keystring + '</div>');
					$('#voverview').text(data.proposal.overview);
					if (data.proposal.filename) {
						dlfile = id;
						$('#vfile-label').removeClass('is-hidden');
						$('#vfile').append('<a title="Download approval form">' + data.proposal.filename + '</a>');
					} else {
						$('#vfile-label').addClass('is-hidden');
					}
					Swal.close();
					$('#view').addClass('is-active');
					$('html').addClass('is-clipped');
				},
				error: function(err) {
					ajaxError(err);
				}
			});
		}
	});

	$('#myp').click(function() {
		if (!$(this).hasClass('is-active')) {
			if ($('#loading').hasClass('is-hidden')) {
				$('.tabs li').removeClass('is-active');
				$(this).addClass('is-active');
				$('#search input').val('');
				tab = 'myp', search = '', link = 'titles';
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
				$($('#add').parent()).removeClass('is-hidden');
				$('#logout').removeClass('is-hidden');
				$('#search input').val('').attr('placeholder', 'Search title, keyword, or name...');
				$('#clear').attr('disabled', true);
				tab = 'all', search = '', link = 'titles';
				retrieveProposals();
			}
		}
	});

	$('#logs').click(function() {
		if (!$(this).hasClass('is-active')) {
			if ($('#loading').hasClass('is-hidden')) {
				$('.tabs li').removeClass('is-active');
				$(this).addClass('is-active');
				$('.column:nth-child(2)').removeClass('is-hidden');
				$('#logout').removeClass('is-hidden');
				$($('#add').parent()).addClass('is-hidden');
				$('#search input').val('').attr('placeholder', 'Search description, date, or time...');
				$('#clear').attr('disabled', true);
				search = '', link = 'logs';
				retrieveLogs();
			}
		}
	});

	$('#students').click(function() {
		if (!$(this).hasClass('is-active')) {
			if ($('#loading').hasClass('is-hidden')) {
				$('.tabs li').removeClass('is-active');
				$(this).addClass('is-active');
				$('#add span:nth-child(2)').text('Add Student');
				$($('#add').parent()).removeClass('is-hidden');
				$('#search input').val('').attr('placeholder', 'Search name or student number...');
				$('#clear').attr('disabled', true);
				search = '', link = 'users';
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
				$($('#add').parent()).removeClass('is-hidden');
				$('#search input').val('').attr('placeholder', 'Search name or number...');
				$('#clear').attr('disabled', true);
				search = '', link = 'users';
				retrieveAdvisers();
			}
		}
	});

	$('#search input').keyup(function() {
		$(this).val() != '' ? $('#clear').removeAttr('disabled') : $('#clear').attr('disabled', true);
	});

	$('#search input').keyup(delay(function(e) {
		$('#search button[title="Search"]').addClass('is-loading');
		search = $(this).val();
		if (request == false) {
			request = true, pending = false;
			if ($('#thesis').hasClass('is-active')) {
				link = 'titles';
				retrieveProposals();
			} else if ($('#myp').hasClass('is-active')) {
				link = 'titles';
				retrieveProposals();
			} else if ($('#logs').hasClass('is-active')) {
				link = 'logs';
				retrieveLogs();
			} else if ($('#students').hasClass('is-active')) {
				link = 'users';
				retrieveStudents();
			} else if ($('#advisers').hasClass('is-active')) {
				link = 'users';
				retrieveAdvisers();
			}
		} else {
			pending = true;
		}
	}, 750));

	$('#search').submit(function(e) {
		e.preventDefault();
		if ($('#loading').hasClass('is-hidden')) {
			$('#search button[title="Search"]').addClass('is-loading');
			search = $('#search input').val();
			if ($('#thesis').hasClass('is-active')) {
				link = 'titles';
				retrieveProposals();
			} else if ($('#myp').hasClass('is-active')) {
				link = 'titles';
				retrieveProposals();
			} else if ($('#logs').hasClass('is-active')) {
				link = 'logs';
				retrieveLogs();
			} else if ($('#students').hasClass('is-active')) {
				link = 'users';
				retrieveStudents();
			} else if ($('#advisers').hasClass('is-active')) {
				link = 'users';
				retrieveAdvisers();
			}
		}
	});

	$('#clear').click(function() {
		if ($('#loading').hasClass('is-hidden')) {
			$('#search input').val('');
			$(this).attr('disabled', true);
			search = '';
			if ($('#thesis').hasClass('is-active')) {
				link = 'titles';
				retrieveProposals();
			} else if ($('#myp').hasClass('is-active')) {
				link = 'titles';
				retrieveProposals();
			} else if ($('#logs').hasClass('is-active')) {
				link = 'logs';
				retrieveLogs();
			} else if ($('#students').hasClass('is-active')) {
				link = 'users';
				retrieveStudents();
			} else if ($('#advisers').hasClass('is-active')) {
				link = 'users';
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
		if ($('#submit_user span:nth-child(2)').text() == 'Add') {
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
		} else {
			$.ajax({
				type: 'POST',
				url: 'users/' + editid + '/update',
				data: {type:user, name:name, student_number:number},
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
		}
	});

	$('#sn').keyup(function() {
		if (!$('#sncontrol').hasClass('is-loading') && $('#sn_field input').attr('readonly') != 'readonly') {
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
								if (editsn != sn) {
									$('#sn').addClass('is-danger');
									$('#sncontrol').append('<div class="help is-danger">' + response.msg + '</div>')
									$('#submit_user').attr('disabled', true);
								} else {
									$('#sn').addClass('is-success').removeAttr('readonly');
								}
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
								if (editsn != sn) {
									$('#sn').addClass('is-danger');
									$('#sncontrol').append('<div class="help is-danger">' + response.msg + '</div>')
									$('#submit_user').attr('disabled', true);
								} else {
									$('#sn').addClass('is-success').removeAttr('readonly');
								}
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

	$('body').delegate('.studedit', 'click', async function() {
		$('button').attr('disabled', true);
		$('input').attr('readonly', true);
		$('#upload').addClass('is-hidden');
		$('#sn_field').removeClass('is-hidden');
		if ($('#students').hasClass('is-active')) {
			$('#sn_field input').attr('required', true).removeAttr('readonly').removeClass('is-static').removeClass('is-hidden');
		} else {
			$('#sn_field input').removeAttr('required').addClass('is-static').removeClass('is-hidden');
		}
		var id = $(this).data('id');
		editid = id;
		const {value: password} = await Swal.fire({
			title: 'Enter admin password',
			input: 'password',
			confirmButtonText: 'Submit',
			inputAttributes: {
				autocapitalize: 'off',
				autocorrect: 'off'
			}
		});
		if (password) {
			Swal.fire({
				html: '<span class="icon is-large"><i class="fas fa-spinner fa-spin fa-2x"></i></span>',
				showConfirmButton: false,
				allowOutsideClick: false,
				allowEscapeKey: false
			});
			$.ajax({
				type: 'POST',
				url: 'users/' + id,
				data: {password:password},
				datatype: 'JSON',
				success: function(data) {
					if (data.status == 'error') {
						Swal.fire({
							icon: 'warning',
							title: 'Unauthorized Access',
							text: data.msg
						});
					} else {
						editsn = data.student_number;
						$('#sn').val(data.student_number);
						$('#name').val(data.name);
						$('#edit_user .help').remove();
						$('#sn').removeClass('is-danger').removeClass('is-success');
						$('#edit_user .subtitle').addClass('is-hidden');
						if ($('#students').hasClass('is-active')) {
							$('#edit_user .modal-card-title').text('Edit Student');
							$('#user_label').text('Student Number');
						} else {
							$('#edit_user .modal-card-title').text('Edit Adviser');
							$('#user_label').text('ID Number');
						}
						$('#submit_user').empty().append('<span class="icon"><i class="fas fa-edit"></i></span><span>Update</span>');
						$('#edit_user').addClass('is-active');
						$('html').addClass('is-clipped');
						Swal.close();
					}
					clearStatus();
					if ($('#advisers').hasClass('is-active'))
						$('#sn_field input').attr('readonly', true);
				},
				error: function(err) {
					ajaxError(err);
				}
			});
		} else {
			clearStatus();
		}
	});

	$('body').delegate('.studremove', 'click', async function() {
		$('button').attr('disabled', true);
		$('input').attr('readonly', true);
		var id = $(this).data('id');
		const {value: password} = await Swal.fire({
			title: 'Enter admin password',
			input: 'password',
			confirmButtonText: 'Submit',
			inputAttributes: {
				autocapitalize: 'off',
				autocorrect: 'off'
			}
		});
		if (password) {
			Swal.fire({
				html: '<span class="icon is-large"><i class="fas fa-spinner fa-spin fa-2x"></i></span>',
				showConfirmButton: false,
				allowOutsideClick: false,
				allowEscapeKey: false
			});
			$.ajax({
				type: 'POST',
				url: 'users/' + id,
				data: {password:password},
				datatype: 'JSON',
				success: function(data) {
					clearStatus();
					Swal.fire({
						icon: 'warning',
						title: 'Confirm Delete',
						html: '<div>Are you sure you want to delete ' + data.name + ' (' + data.student_number + ')?<div><div class="help">Any proposals and logs related to this user will be permanently deleted.</div>',
						confirmButtonText: 'Yes',
						showCancelButton: true,
						cancelButtonText: 'No',
					}).then((result) => {
						if (result.value) {
							Swal.fire({
								title: 'Deleting User',
								html: '<span class="icon is-large"><i class="fas fa-spin fa-spinner fa-2x"></i></span>',
								showConfirmButton: false,
								allowOutsideClick: false,
								allowEscapeKey: false
							});
							$.ajax({
								type: 'POST',
								url: 'users/' + id + '/delete',
								datatype: 'JSON',
								success: function(response) {
									Swal.fire({
										icon: 'success',
										title: response.msg,
										showConfirmButton: false,
										timer: 2500
									}).then(function() {
										$('#students').hasClass('is-active') ? retrieveStudents() : retrieveAdvisers();
									});
								},
								error: function(err) {
									ajaxError(err);
								}
							});
						}
					});
				},
				error: function(err) {
					clearStatus();
					ajaxError(err);
				}
			});
		} else {
			clearStatus();
		}
	});

	$('.sn').keyup(function() {
		var id = $(this).attr('id');
		$(this).removeClass('is-danger');
		$('#' + id + '_name').removeClass('has-text-danger').val('');
		if ($(this).val().length > 11) $(this).val($(this).val().slice(0, 11));
		sn_error[id] = false;
		clearStatus();
		sn_proposalCheck();
		if ($(this).val().length == 11) {
			let sn = $(this).val();
			$('#' + id + '_control').addClass('is-loading');
			$('#' + id).attr('readonly', true);
			$('button').attr('disabled', true);
			$.ajax({
				type: 'POST',
				url: 'users/validate',
				data: {data:'students', student_number:sn},
				datatype: 'JSON',
				success: function(data) {
					if (data) {
						$('#' + id + '_name').val(data).removeClass('is-danger');
						sn_error[id] = false;
					} else {
						$('#' + id).addClass('is-danger');
						$('#' + id + '_name').val('Not registered.').addClass('has-text-danger');
						sn_error[id] = true;
					}
					clearStatus();
					sn_proposalCheck();
					$('#' + id + '_control').removeClass('is-loading');
				},
				error: function(err) {
					ajaxError(err);
					clearStatus();
					$('#' + id + '_control').removeClass('is-loading');
				}
			});
		}
	});

	$('#title').keyup(function() {
		$(this).removeClass('is-success').removeClass('is-danger');
		$('#title_control .help').remove();
		$('#submit').removeAttr('disabled');
	});

	$('#title').focusout(function() {
		$('#title_control').addClass('is-loading');
		$('button').attr('disabled', true);
		$(this).removeClass('is-success').removeClass('is-danger');
		$('#title_control .help').remove();
		sn_error['title'] = false;
		var title = $(this).val();
		$.ajax({
			type: 'POST',
			url: 'titles',
			data: {data:'validate', title:title},
			datatype: 'JSON',
			success: function(response) {
				if (response.status == 'validated') {
					$('#title').addClass('is-success');
				} else if (response.status == 'error') {
					$('#title').addClass('is-danger');
					$('#title_control').append('<div class="help is-danger">This title already exists</div>');
					sn_error['title'] = true;
				}
				$('#title_control').removeClass('is-loading');
				clearStatus();
				sn_proposalCheck();
			},
			error: function(err) {
				$('#title_control').removeClass('is-loading');
				sn_error['title'] = true;
				sn_proposalCheck();
				ajaxError(err);
				clearStatus();
			}
		});
	});

	$('.rnd').click(function() {
		$('#rnd_details').addClass('is-active');
		$('html').addClass('is-clipped');
	});

	$('#file').change(function(e) {
		if (e.target.files.length > 0) {
			let valid = false, filename = e.target.files[0].name, validExtensions = ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf'];
			for (let i = 0; i < validExtensions.length; i++) {
				let extension = validExtensions[i];
				if (filename.substr(filename.length - extension.length, extension.length).toLowerCase() == extension.toLowerCase()) {
					valid = true;
					break;
				}
			}
			if (!valid) {
				Swal.fire({
					icon: 'error',
					title: 'Invalid File',
					text: 'Allowed files are: ' + validExtensions.join(', ')
				});
			} else {
				$('.file-name').text(e.target.files[0].name);
				$('.file-cta').animate({
					width: '50px'
				});
			}
		}
	});

	$('body').delegate('#vfile a', 'click', function() {
		// window.open('/thesisb/public/titles/' + dlfile + '/attachment', '_blank');
		window.open('/thesisarchiving/titles/' + dlfile + '/attachment', '_blank');
	});

	$('body').delegate('.pagination a', 'click', function() {
		link = $(this).data('url');
		if ($('#thesis').hasClass('is-active')) {
			retrieveProposals();
		} else if ($('#logs').hasClass('is-active')) {
			retrieveLogs();
		} else if ($('#students').hasClass('is-active')) {
			retrieveStudents();
		} else if ($('#advisers').hasClass('is-active')) {
			retrieveAdvisers();
		}
	});

	$('body').delegate('.pagination form', 'submit', function(e) {
		e.preventDefault();
		let page = $('#page input').val();
		if (page > lastPage || page < 0) {
			$('#page input').addClass('is-danger');
		} else {
			if ($('#thesis').hasClass('is-active')) {
				// link = 'http://localhost/thesisb/public/titles?page=' + page;
				link = 'https://ueccssrnd.tech/thesisarchiving/titles?page=' + page;
				retrieveProposals();
			} else if ($('#logs').hasClass('is-active')) {
				// link = 'http://localhost/thesisb/public/logs?page=' + page;
				link = 'https://ueccssrnd.tech/thesisarchiving/logs?page=' + page;
				retrieveLogs();
			} else if ($('#students').hasClass('is-active')) {
				// link = 'http://localhost/thesisb/public/users?page=' + page;
				link = 'https://ueccssrnd.tech/thesisarchiving/users?page=' + page;
				retrieveStudents();
			} else if ($('#advisers').hasClass('is-active')) {
				// link = 'http://localhost/thesisb/public/users?page=' + page;
				link = 'https://ueccssrnd.tech/thesisarchiving/users?page=' + page;
				retrieveAdvisers();
			}
		}
	});

	$('select').change(function() {
		if ($(this).val() != '')
			$(this).find('option[value=""]').remove();
	});

	$('#upload button').click(function() {
		$('#import').click();
	});

	$('#import').change(function(e) {
		if (e.target.files.length > 0) {
			let valid = false, filename = e.target.files[0].name, validExtensions = ['.xlsx', '.xls'];
			for (let i = 0; i < validExtensions.length; i++) {
				let extension = validExtensions[i];
				if (filename.substr(filename.length - extension.length, extension.length).toLowerCase() == extension.toLowerCase()) {
					valid = true;
					break;
				}
			}
			if (!valid) {
				Swal.fire({
					icon: 'error',
					title: 'Invalid File',
					text: 'Allowed files are: ' + validExtensions.join(', ')
				});
				$('#submit_user').attr('disabled', true);
			} else {
				Swal.fire({
					html: '<span class="icon is-large"><i class="fas fa-spinner fa-spin fa-2x"></i></span>',
					showConfirmButton: false,
					allowOutsideClick: false,
					allowEscapeKey: false
				});
				var data = new FormData($('#user_form')[0]);
				data.append('file', $('#import')[0].files[0]);
				$.ajax({
					type: 'POST',
					url: 'users/import',
					data: data,
					processData: false,
					contentType: false,
					datatype: 'JSON',
					success: function(response) {
						$('.modal').removeClass('is-active');
						$('html').removeClass('is-clipped');
						Swal.fire({
							icon: response.status,
							title: response.msg,
							showConfirmButton: false,
							timer: 2500
						}).then(function() {
							retrieveStudents();
						});
						clearStatus();
						$('#submit_user').removeClass('is-loading');
					},
					error: function(err) {
						clearStatus();
						$('#submit_user').removeClass('is-loading');
						ajaxError(err);
					}
				});
			}
		}
	});
});
