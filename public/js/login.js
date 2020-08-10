$(function() {
	function clearStatus() {
		$('button').removeClass('is-loading');
		$('#student_num').removeAttr('readonly');
	}

	$('.pageloader .title').text('Loading Login');

	$('#student_num').keyup(function() {
		if ($(this).val().length > 11) $(this).val($(this).val().slice(0, 11));
		if ($(this).val().length == 11) $('form').submit();
	});

	$('form').submit(function(e) {
		e.preventDefault();
		if (!$('button').hasClass('is-loading')) {
			$('#student_num').attr('readonly', true);
			$('button').addClass('is-loading');
			let studentnum = $('#student_num').val();
			$.ajax({
				type: 'POST',
				url: 'login',
				data: {student:studentnum, data:'login'},
				datatype: 'JSON',
				success: function(response) {
					if (response.status == 'success') {
						Swal.fire({
							icon: 'success',
							title: response.msg,
							showConfirmButton: false,
							timer: 2500
						}).then(function() {
							$('.pageloader .title').text('Loading Dashboard');
							$('.pageloader').addClass('is-active');
							window.location.href = '/thesisb/public';
							// window.location.href = '/thesisarchiving';
						});
					} else {
						Swal.fire({
							icon: 'error',
							title: 'Login Error',
							text: response.msg,
							confirmButtonText: 'Try Again'
						});
					}
					clearStatus();
				},
				error: function(err) {
					console.log(err);
					if (err.status == 409) {
						Swal.fire({
							icon: 'error',
							title: 'Too Many Log In Attempts',
							text: 'Try loggin in again in a few minutes',
						});
					} else {
						Swal.fire({
							icon: 'error',
							title: 'Cannot Connect to Server',
							text: 'Something went wrong. Please try again later.'
						});
					}
					clearStatus();
				}
			});
		}
	});
});
