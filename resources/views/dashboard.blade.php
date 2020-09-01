@extends('_layout')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
<link rel="stylesheet" href="{{ asset('css/bulma-ribbon.min.css') }}">
<link rel="stylesheet" href="{{ asset('css/bulma-tagsinput.min.css') }}">
<link rel="stylesheet" href="{{ asset('css/bulma-divider.min.css') }}">
@endsection

@section('body')
<div id="body" class="box">
	<div class="columns">
		<div class="column is-hidden-mobile">
			<figure class="image is-64x64"><img src="{{ asset('img/CCSSlogo.png') }}" alt="CCSS Logo"></figure>
		</div>
		<div class="column">
			<div class="title is-4 has-text-centered">CCSS Thesis Archiving</div>
		</div>
		<div class="column">
			<a class="rnd" title="About Developers">
				<figure class="image is-64x64 is-hidden-mobile is-pulled-right"><img src="{{ asset('img/RnDlogo.png') }}" alt="UE Logo"></figure>
			</a>
			<div class="level is-hidden-tablet is-mobile">
				<div class="level-item">
					<figure class="image is-48x48"><img src="{{ asset('img/UElogo.png') }}" alt="UE Logo"></figure>
				</div>
				<div class="level-item">
					<figure class="image is-48x48"><img src="{{ asset('img/CCSSlogo.png') }}" alt="CCSS Logo"></figure>
				</div>
				<div class="level-item">
					<a class="rnd" title="About Developers">
						<figure class="image is-48x48"><img src="{{ asset('img/RnDlogo.png') }}" alt="R&D Logo"></figure>
					</a>
				</div>
			</div>
		</div>
	</div>
	<div id="header" class="columns is-mobile">
		<div class="column is-8">
			@if (Auth::user()->type == 'STUDENT') 
			<h3 class="title">Student Dashboard</h3>
			@else
			<h3 class="title">Dashboard</h3>
			@endif
			<div class="subtitle is-5">{{ Auth::user()->name }}</div>
		</div>
		<div id="logout" class="column">
			<form class="is-pulled-right" method="POST">
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
						<button class="button is-info" type="submit" title="Search">
							<span class="icon">
								<i class="fas fa-search"></i>
							</span>
						</button>
					</div>
					<div class="control">
						<button id="clear" class="button is-info" type="button" title="Clear" disabled>
							<span class="icon">
								<i class="fas fa-times"></i>
							</span>
						</button>
					</div>
				</div>
			</form>
		</div>
		@if (Auth::user()->type == 'ADMIN')
		<div class="column is-3 is-2-widescreen">
			<button id="add" class="button is-info is-fullwidth">
				<span class="icon">
					<i class="fas fa-plus"></i>
				</span>
				<span>Add Proposal</span>
			</button>
		</div>
		@endif
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
			@if (Auth::user()->type != 'ADMIN')
			<li id="myp">
				<a>
					@if (Auth::user()->type == 'STUDENT')
					My Proposals
					@else
					Advisees
					@endif 
				</a>
			</li>
			@endif
			@if (Auth::user()->type == 'ADMIN')
			<li id="students">	
				<a title="Students">
					<span class="icon">
						<i class="fas fa-users"></i>
					</span>
					<span>Students</span>
				</a>
			</li>
			<li id="advisers">
				<a title="Advisers">
					<span class="icon">
						<i class="fas fa-chalkboard-teacher"></i>
					</span>
					<span>Advisers</span>
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
			@endif
		</ul>
	</div>
	<div id="contents">
		<div id="loading" class="has-text-centered is-hidden">
			<span class="icon">
				<i class="fas fa-spin fa-spinner"></i>
			</span>
			<div class="subtitle is-6">Loading</div>
		</div>
		{{-- <a class="box">
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
		</a> --}}
	</div>
</div>

<div id="edit" class="modal">
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
								<select id="program" required>
									<option value="" selected disabled>Choose Program</option>
									<option value="BSCS">BSCS</option>
									<option value="BSIT">BSIT</option>
									<option value="BSEMCDA">BSEMC - DA</option>
									<option value="BSEMCGD">BSEMC - GD</option>
									<option value="BSIS">BSIS</option>
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
						<div id="title_control" class="control is-expanded">
							<input type="text" id="title" class="input" maxlength="250" placeholder="Proposed thesis title" required>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Research Area</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control is-expanded">
							<input type="text" id="area" class="input">
						</div>
					</div>
				</div>
			</div>
			<div id="note" class="field is-horizontal is-horizontal">
				<div class="field-label">
					<label class="label">Students' Information</label>
				</div>
				<div class="field-body">
					<div class="has-text-danger">Editing of student information is not available. To update student information, delete this proposal and create a new one with the correct student information.</div>
				</div>
			</div>
			<div class="field is-horizontal si">
				<div class="field-label">
					<label class="label">Students' Information</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div id="snum1_control" class="control">
							<input type="number" id="snum1" class="input sn" placeholder="S.N. #1" required>
						</div>
					</div>
					<div class="field">
						<div class="control is-expanded">
							<input type="text" class="input name" id="snum1_name" readonly required>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal si">
				<div class="field-label"></div>
				<div class="field-body">
					<div class="field">
						<div id="snum2_control" class="control">
							<input type="number" id="snum2" class="input sn" placeholder="S.N. #2">
						</div>
					</div>
					<div class="field">
						<div class="control is-expanded">
							<input type="text" class="input name" id="snum2_name" readonly>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal si">
				<div class="field-label"></div>
				<div class="field-body">
					<div class="field">
						<div id="snum3_control" class="control">
							<input type="number" id="snum3" class="input sn" placeholder="S.N. #3">
						</div>
					</div>
					<div class="field">
						<div class="control is-expanded">
							<input type="text" class="input name" id="snum3_name" readonly>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal si">
				<div class="field-label"></div>
				<div class="field-body">
					<div class="field">
						<div id="snum4_control" class="control">
							<input type="number" id="snum4" class="input sn" placeholder="S.N. #4">
						</div>
					</div>
					<div class="field">
						<div class="control is-expanded">
							<input type="text" class="input name" id="snum4_name" readonly>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal si">
				<div class="field-label"></div>
				<div class="field-body">
					<div class="field">
						<div id="snum5_control" class="control">
							<input type="number" id="snum5" class="input sn" placeholder="S.N. #5">
						</div>
					</div>
					<div class="field">
						<div class="control is-expanded">
							<input type="text" class="input name" id="snum5_name" readonly>
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
							<div id="adviser_select" class="select is-fullwidth">
								<select id="adviser"></select>
							</div>
							<div id="thesis_note" class="has-text-danger is-hidden">No advisers registered.</div>
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
							<input type="tags" id="keywords" class="input" data-type="tags">
						</div>
						<div class="help">Press enter to input keyword</div>
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
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Approval Date</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control is-expanded">
							<input type="date" id="date" class="input" required>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Approval Form</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<div id="file" class="file has-name">
								<label class="file-label">
									<input type="file" class="file-input">
									<div class="file-cta" title="Upload a file">
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
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Status</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control is-expanded">
							<div class="select is-fullwidth">
								<select id="status" required>
									<option value="" selected disabled>Choose Status</option>
									<option value="PROPOSAL">Proposal</option>
									<option value="DEVELOPMENT">Development</option>
									<option value="DEPLOYMENT">Deployment</option>
									<option value="COMPLETED">Completed</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<footer class="modal-card-foot">
			<div class="buttons">
				<button id="submit" class="button is-success" type="submit">
					<span class="icon">
						<i class="fas fa-plus"></i>
					</span>
					<span>Add</span>
				</button>
				<button class="button is-danger is-outlined cancel" type="button">Cancel</button>
			</div>
		</footer>
	</form>
</div>

<div id="view" class="modal">
	<div class="modal-background"></div>
	<div class="modal-card">
		<header class="modal-card-head">
			<div class="modal-card-title">View Proposal</div>
			<span class="delete"></span>
		</header>
		<section class="modal-card-body">
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Program</label>
				</div>
				<div id="vprogram" class="field-body"></div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Title</label>
				</div>
				<div id="vtitle" class="field-body"></div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Research Area</label>
				</div>
				<div id="varea" class="field-body"></div>
			</div>
			<div id="vsi-label" class="field is-horizontal">
				<div class="field-label">
					<label class="label">Student's Information</label>
				</div>
				<div id="vsi" class="field-body"></div>
			</div>
			<div id="vadviser-label" class="field is-horizontal">
				<div class="field-label">
					<label class="label">Thesis Adviser</label>
				</div>
				<div id="vadviser" class="field-body"></div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Keywords</label>
				</div>
				<div id="vkeywords" class="field-body"></div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Brief Overview</label>
				</div>
				<div id="voverview" class="field-body"></div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Approval Date</label>
				</div>
				<div id="vdate" class="field-body"></div>
			</div>
			<div id="vfile-label" class="field is-horizontal">
				<div class="field-label">
					<label class="label">Approval Form</label>
				</div>
				<div id="vfile" class="field-body"></div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Status</label>
				</div>
				<div id="vstatus" class="field-body"></div>
			</div>
		</section>
	</div>
</div>

<div id="edit_user" class="modal">
	<div class="modal-background"></div>
	<form id="user_form" class="modal-card">
		<header class="modal-card-head">
			<div class="modal-card-title"></div>
			<span class="delete"></span>
		</header>
		<section class="modal-card-body">
			<div id="upload">
				<input id="import" type="file" hidden>
				<button class="button is-link is-light is-fullwidth" type="button" title="Feature not yet available">
					<span class="icon">
						<i class="fas fa-file-excel"></i>
					</span>
					<span>Upload Excel</span>
				</button>
				<div class="divider">OR</div>
			</div>
			<div class="subtitle is-5 has-text-centered"></div>
			<div id="sn_field" class="field is-horizontal">
				<div class="field-label">
					<label id="user_label" class="label">Student Number</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div id="sncontrol" class="control">
							<input type="text" class="input" id="sn" placeholder="XXXXXXXXXXX" required>
						</div>
					</div>
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Name</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<input type="text" class="input" id="name" placeholder="Last Name, First Name M.I." required>
						</div>
					</div>
				</div>
			</div>
		</section>
		<footer class="modal-card-foot">
			<div class="buttons">
				<button id="submit_user" class="button is-success" type="submit">
					<span class="icon">
						<i class="fas fa-plus"></i>
					</span>
					<span>Add</span>
				</button>
				<button class="button is-danger is-outlined cancel" type="button">Cancel</button>
			</div>
		</footer>
	</form>
</div>

<div id="rnd_details" class="modal">
	<div class="modal-background"></div>
	<div class="modal-card">
		<header class="modal-card-head">
			<div class="modal-card-title">About Developers</div>
			<span class="delete"></span>
		</header>
		<section class="modal-card-body">
			<figure class="image is-64x64 is-pulled-left"><img src="{{ asset('img/RnDlogo.png') }}" alt="R&D Logo"></figure>
			<p class='help'>V1.11.1b</p>
			<p>The UE CCSS Research and Development Unit (R&D) is the research arm of University of the East - College of Computer Studies and Systems.</p>
			<p>The R&D unit, led by R&D coordinator Melie Jim Sarmiento and R&D team leader Mack Perry Co, has been creating systems and applications benefiting the students of the college and the university.</p>
			<p><br>This system is designed and developed by R&D team leader Mack Perry Co for the incoming upperclassmen who are pursuing Methods of Research (MERIT). This system is copyrighted to the UE CCSS R&D Unit.</p>
		</section>
	</div>
</div>
@endsection

@section('scripts')
<script src="{{ asset('js/dashboard.js') }}"></script>
<script src="{{ asset('js/bulma-tagsinput.min.js') }}"></script>
@endsection
