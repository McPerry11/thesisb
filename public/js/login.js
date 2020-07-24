$(function {
	$('.pageloader .title').text('Loading Login');

	$('#student_num').

	$('form').submit(function(e) {
		e.preventDefault();
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
						timer: 2500,
					});
				} else {
					Swal.fire({
						icon: 'error',
						title: 'Login Error',
						text: response.msg,
						confirmButtonText: 'Try Again',
					});
				}
			},
			error: function(err) {
				console.log(err);
				Swal.fire({
					icon: 'error',
					title: 'Cannot Connect to Server',
					text: 'Something went wrong. Please try again later.',
				});
			}
		});
	})
});