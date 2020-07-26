@extends('_layout')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
@endsection

@section('body')
<div class="box">
	<div id="header" class="columns is-mobile">
		<div class="column is-8">
			<h3 class="title">Dashboard</h3>
		</div>
		<div class="column">
			<form class="is-pulled-right">
				@csrf
				<button class="button is-danger" title="Log Out">
					<span class="icon">
						<i class="fas fa-sign-out-alt"></i>
					</span>
					<p>Log Out</p>
				</button>
			</form>
		</div>
	</div>
	<div class="columns">
		<div class="column">
			<form id="search">
				<div class="field has-addons">
					<div class="control is-expanded">
						<input type="text" class="input" placeholder="Search title, keyword, or name...">
					</div>
					<div class="control">
						<button class="button is-info" title="Search">
							<span class="icon">
								<i class="fas fa-search"></i>
							</span>
						</button>
					</div>
				</div>
			</form>
		</div>
		<div class="column is-3 is-2-widescreen">
			<button class="button is-info is-fullwidth">
				<span class="icon">
					<i class="fas fa-plus"></i>
				</span>
				<p>Add Proposal</p>
			</button>
		</div>
	</div>
</div>
@endsection

@section('scripts')
<script src="{{ asset('js/dashboard.js') }}"></script>
@endsection