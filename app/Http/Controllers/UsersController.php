<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Log;
use Auth;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->data == 'students') {
            if ($request->search == '') {
                return User::where('type', 'STUDENT')->orderby('updated_at', 'desc')->get();
            }
            return User::where('type', 'STUDENT')
            ->where('name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('student_number', 'LIKE', '%' . $request->search . '%')
            ->orderBy('updated_at', 'desc')->get();
        } else if ($request->data == 'advisers') {
            if ($request->search == '') {
                return User::where('type', 'ADVISER')->orderBy('updated_at', 'desc')->get();
            }
            return User::where('type', 'ADVISER')
            ->where('name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('student_number', 'LIKE', '%' . $request->search . '%')
            ->orderBy('updated_at', 'desc')->get();
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $count = User::where('student_number', $request->student_number)->where('type', $request->type)->count();
        if ($count > 0) {
            if ($request->type == 'STUDENT')
                return response()->json(['status' => 'error', 'msg' => 'This student number is already registered.']);
            else
                return response()->json(['status' => 'error', 'msg' => 'This ID number is already registerd.']);
        }
        return response()->json(['status' => 'success']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (Auth::user()->type == 'ADMIN') {
            $user = new User;

            $user->fill($request->only([
                'name',
                'type'
            ]));

            if ($user->type == 'STUDENT')
                $user->student_number = $request->student_number;
            else {
                $string = strtoupper(substr(str_replace(',', '', str_replace(' ', '', $user->name)), 0, 3));
                do {
                    $user->student_number = $string . str_pad(rand(0, pow(10, 4) - 1), 4, '0', STR_PAD_LEFT);
                } while (User::where('student_number', $user->student_number)->where('type', 'ADVISER')->count() > 0);
            }

            $user->password = '12345';

            $user->save();
            Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' registered a new ' . strtolower($user->type) . ': ' . $user->name . '.']);

            return response()->json(['msg' => 'Registered Successfully']);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        if ($request->data == 'advisers') {
            return User::select('id', 'name')->where('type', 'ADVISER')->orderBy('name', 'asc')->get();
        } else if ($request->data == 'students') {
            return User::where('student_number', $request->student_number)->value('name');
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if (Auth::user()->user() == 'ADMIN') {
            return User::select('name', 'student_number')->find($id);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (Auth::user()->type == 'ADMIN') {
            $user = User::find($id);

            $user->fill($request->only([
                'name',
            ]));

            if ($request->type == 'STUDENT')
                $user->student_number = $request->student_number;

            $user->save();
            Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' updated a registered ' . strtolower($user->type) . ': ' . $user->name . '.']);

            return response()->json(['msg' => 'Updated Successfully']);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (Auth::user()->type == 'ADMIN') {
            $user = User::find($id);

            Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' deleted a registered ' . strtolower($user->type) . ': ' . $user->name . '.']);
            $user->delete();

            return response()->json(['msg' => 'Deleted Successfully']);
        }
    }
}
