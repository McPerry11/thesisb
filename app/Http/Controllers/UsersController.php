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
            if ($request->saerch == '') {
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
        $user = new User;

        $user->fill($request->only([
            'name',
            'student_number',
            'type'
        ]));

        $user->password = '12345';

        $user->save();
        Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' registered a new ' . strtolower($user->type) . ': ' . $user->name . '.']);

        return response()->json(['msg' => 'Registered Successfully']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
