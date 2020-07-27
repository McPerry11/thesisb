@extends('_layout')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
<link rel="stylesheet" href="{{ asset('css/bulma-tagsinput.min.css') }}">
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
						<button class="button is-info" type="submit" title="This feature is still unavailable" disabled>
							<span class="icon">
								<i class="fas fa-search"></i>
							</span>
						</button>
					</div>
				</div>
			</form>
		</div>
		<div class="column is-3 is-2-widescreen">
			<button id="add" class="button is-info is-fullwidth">
				<span class="icon">
					<i class="fas fa-plus"></i>
				</span>
				<span>Add Proposal</span>
			</button>
		</div>
	</div>
	<div class="tabs is-boxed">
		<ul>
			<li id="thesis">
				<a>
					<span class="icon">
						<i class="fas fa-book"></i>
					</span>
					<span>Thesis Titles</span>
				</a>
			</li>
			<li id="logs">
				<a title="This feature is still unavailable">
					<span class="icon">
						<i class="fas fa-stream"></i>
					</span>
					<span>Logs</span>
				</a>
			</li>
		</ul>
	</div>
	<div id="contents">
		<a class="box">
			<div class="columns">
				<div class="column">
					<h3 class="title is-4">Thesis Title</h3>
					<h4 class="subtitle is-5">Registration ID</h4>
					<div class="tags is-hidden-mobile">
						<span class="tag">Keyword 1</span>
						<span class="tag">Keyword 2</span>
						<span class="tag">Keyword 3</span>
						<span class="tag">Keyword 4</span>
						<span class="tag">Keyword 5</span>
						<span class="tag">Keyword 6</span>
						<span class="tag">Keyword 9</span>
					</div>
					<div class="tags">
						<span class="tag is-info">Thesis Adviser</span>
						<span class="tag is-info is-light">Student 1</span>
						<span class="tag is-info is-light">Student 2</span>
						<span class="tag is-info is-light">Student 3</span>
						<span class="tag is-info is-light">Student 4</span>
						<span class="tag is-info is-light">Student 5</span>
					</div>
				</div>
				<div class="column is-2-desktop is-3-tablet">
					<div class="buttons is-right">
						<button class="button">
							<span class="icon">
								<i class="fas fa-edit"></i>
							</span>
						</button>
						<button class="button is-danger is-inverted">
							<span class="icon">
								<i class="fas fa-trash"></i>
							</span>
						</button>
					</div>
				</div>
			</div>
		</a>
	</div>
</div>

<div class="modal">
	<div class="modal-background"></div>
	<form id="proposal" class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title"></p>
			<span class="delete"></span>
		</header>
		<section class="modal-card-body">
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Program</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<div class="select is-fullwidth">
								<select id="program">
									<option value="">BSCS</option>
									<option value="">BSIT</option>
									<option value="">BSEMC - DA</option>
									<option value="">BSEMC - GD</option>
									<option value="">BSIS</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Title</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control is-expanded">
							<input type="text" class="input" placeholder="Proposed thesis title" required>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Students' Information</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<input type="number" id="snum1" class="input sn" placeholder="S.N. #1" required>
						</div>
					</div>
					<div class="field">
						<div class="control is-expanded">
							<input type="text" id="sname1" class="input" placeholder="Last Name, First Name M.N." required>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label"></div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<input type="number" id="snum2" class="input sn" placeholder="S.N. #2" required>
						</div>
					</div>
					<div class="field">
						<div class="control is-expanded">
							<input type="text" id="sname2" class="input" placeholder="Last Name, First Name M.N." required>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label"></div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<input type="number" id="snum3" class="input sn" placeholder="S.N. #3" required>
						</div>
					</div>
					<div class="field">
						<div class="control is-expanded">
							<input type="text" id="sname3" class="input" placeholder="Last Name, First Name M.N." required>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label"></div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<input type="number" id="snum4" class="input sn" placeholder="S.N. #4" required>
						</div>
					</div>
					<div class="field">
						<div class="control is-expanded">
							<input type="text" id="sname4" class="input" placeholder="Last Name, First Name M.N." required>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label"></div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<input type="number" id="snum5" class="input sn" placeholder="S.N. #5">
						</div>
					</div>
					<div class="field">
						<div class="control is-expanded">
							<input type="text" id="sname5" class="input" placeholder="Last Name, First Name M.N.">
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Thesis Adviser</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control is-expanded">
							<input type="text" id="adviser" class="input" placeholder="Last Name, First Name M.N." required>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Keywords</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control is-expanded">
							<input type="text" class="input">
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Brief Overview</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control is-expanded">
							<textarea id="overview" class="textarea"></textarea>
						</div>
					</div>
				</div>
			</div>
		</section>
		<footer class="modal-card-foot">
			<div class="buttons is-right">
				<button class="button is-success">
					<span class="icon">
						<i class="fas fa-plus"></i>
					</span>
					<span>Add</span>
				</button>
				<button id="cancel" class="button is-danger is-outlined">Cancel</button>
			</div>
		</footer>
	</form>
</div>
@endsection

@section('scripts')
<script src="{{ asset('js/dashboard.js') }}"></script>
<script src="{{ asset('js/bulma-tagsinput.min.js') }}"></script>
@endsection