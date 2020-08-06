<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Title;
use App\User;
use App\Log;
use Carbon\Carbon;
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
					Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' logged in.', 'created_at' => Carbon::now('+8:00')]);
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

	public function logs(Request $request) {
		if ($request->search) {
			return Log::where('description', 'LIKE', '%' . $request->search . '%')
			->orWhere('created_at', 'LIKE', '%' . $request->search . '%')
			->orderBy('updated_at', 'desc')->get();
		} else {
			return Log::orderBy('updated_at', 'desc')->get();
		}
	}

	public function logout(Request $request) {
		Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' logged out.', 'created_at' => Carbon::now('+8:00')]);
		Auth::logout();
		return redirect('login');
	}
}
