<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

class IndexController extends Controller
{
	public function login() {
		if (Auth::user()) {
			return redirect('');
		}
		return view('login');
	}

	public function dashboard() {
		if (Auth::user()->type == 'ADMIN') {
			return view('dashboard');
		}
		return view('student_dashboard');
	}
}
