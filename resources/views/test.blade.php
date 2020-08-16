@extends('_layout')

@section('body')
<form action="">
	<div class="field is-horizontal">
		<div class="field-label">
			<label class="label">Approval Form</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control">
					<div id="file" class="file has-name is-fullwidth">
						<label class="file-label">
							<input type="file" class="file-input">
							<div class="file-cta">
								<span class="icon">
									<i class="fas fa-upload"></i>
								</span>
								<span class="file-label">
									Choose a file
								</span>
							</div>
							<div class="file-name">
								No file uploaded
							</div>
						</label>
					</div>
				</div>
			</div>
		</div>
	</div>
	<button class="button is-success" type="submit">Submit</button>
</form>
@endsection

@section('scripts')
<script src="{{ asset('js/test.js') }}"></script>
@endsection