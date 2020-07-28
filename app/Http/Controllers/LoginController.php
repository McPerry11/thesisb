<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Auth;

class LoginController extends Controller
{
	public function get_login() {
		if (Auth::user()) {
			return redirect('');
		}
		return view('login');
	}

	public function post_login(Request $request) {
		if ($request->data == 'login') {
			$user = User::where('student_number', $request->student)->get();
			if (count($user) == 0) {
				return response()->json(['status' => 'error_ne', 'msg' => 'This student number is not registered in the system.']);
			} else {
				if (Auth::attempt(['student_number' => $request->student, 'password' => '12345'])) {
					return response()->json(['status' => 'success', 'msg' => 'Login Successful']);
				} else {
					return response()->json(['status' => 'error_ne', 'msg' => 'This student number is not registered in the system.']);
				}
			}
		}
	}

	public function dashboard() {
		return view('dashboard');
	}

	public function getSN() {
		return Auth::user()->student_number;
	}

	public function logout(Request $request) {
		Auth::logout();
		return redirect('login');
	}
}
