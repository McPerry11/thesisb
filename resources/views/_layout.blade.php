<!DOCTYPE html>
<html lang="en" class="has-background-success">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<meta charset="UTF-8">
	<title>Thesis B</title>
	@include('_styles')
	@yield('styles')
</head>
<body>
	<div class="pageloader is-success is-bottom-to-top is-active">
		<span class="title"></span>
	</div>
	<div id="nojs" class="container is-fluid">
		<div class="columns is-vcentered is-centered is-mobile">
			<div class="column is-12-mobile is-7-tablet is-5-desktop is-4-widescreen">
				<div class="box has-text-centered">
					<h4 class="title is-4">This page requires JavaScript to fully function.</h4>
					<h5 class="subtitle is-5">Please turn on JavaScript and try again.</h5>
				</div>
			</div>
		</div>
	</div>
	<div class="container is-fluid">
		@yield('body')
	</div>
	
	@include('_scripts')
	@yield('scripts')
</body>
</html>