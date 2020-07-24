@extends('_layout')

@section('body')
<div class="columns is-centered is-vcentered is-mobile">
	<div class="column is-12-mobile is-7-tablet is-5-desktop is-4-widescreen">
		<form class="card has-text-centered">
			<div class="card-content">
				<div class="columns is-mobile">
					<div class="column">
						<figure class="image is-64x64"><img src="{{ asset('img/UElogo.png') }}" alt="UE Logo"></figure>
					</div>
					<div class="column">
						<figure class="image is-64x64 is-pulled-right"><img src="{{ asset('img/CCSSlogo.png') }}" alt="CCSS Logo"></figure>
					</div>
				</div>
				<h3 class="title is-4">UE CCSS Thesis Title Proposal</h3>
				<div class="field">
					<div class="control has-icons-left">
						<input type="number" id="student_num" class="input" placeholder="Student Number" required>
						<span class="icon is-left"><i class="fas fa-hashtag"></i></span>
					</div>
					<p class="help has-text-left">Log in using your student number</p>
				</div>
				<button class="button is-success" type="submit">LOG N</button>
			</div>
		</form>
	</div>
</div>
@endsection
