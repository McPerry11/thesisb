<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Auth;

class LoginController extends Controller
{
	public function login(Request $request) {
		if ($request->data == 'login') {
			$user = User::where('student_number', $request->student)->get();
			if (count($user) == 0) {
				return response()->json(['status' => 'error_ne', 'msg' => 'This student number is not registered in the system.']);
			} else if (count($user) > 1) {
				return response()->json(['status' => 'error_du', 'msg' => 'An error has occurred within the database. Please contact an admin.']);
			} else {
				if (Auth::attempt(['student_number' => $request->student, 'password' => '12345'])) {
					return response()->json(['status' => 'success', 'msg' => 'Login Successful']);
				} else {
					return response()->json(['status' => 'error_ne', 'msg' => 'This student number is not registered in the system.']);
				}
			}
		}
	}

	public function logout(Request $request) {
		Auth::logout();
		return redirect('login');
	}
}
