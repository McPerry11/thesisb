$(function() {
	$('#file input').change(function(e) {
		if (e.target.files.length > 0) {
			let form_data = new FormData();

			form_data.append('file', $(this).prop('files')[0]);

			$.ajax({
				type: 'POST',
				url: 'test',
				data: {file:form_data},
				dataType: 'JSON',
				processData: false,
				contentType: false,
				success: function(response) {
					console.log(response);
				},
				error: function(err) {
					console.log(err);
				}
			});
		}
	});
});