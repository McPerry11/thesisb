<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class LoginController extends Controller
{
	public function login(Request $request) {
		if ($request->data == 'login') {
			$exist = User::where('student_number', $request->student)->count();
			if ($exist == 0) {
				return response()->json('status' => 'error_ne', 'msg' => 'This student number does not exist');
			} else if ($exist > 1) {
				return response()->json('status' => 'error_du', 'msg' => 'An error has occurred within the database. Please contact an admin.');
			} else {
				return response()->json('status' => 'success', 'msg' => 'Login Successful');
			}
		}
	}

	public function logout(Request $request) {

	}
}
