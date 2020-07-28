<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Title;
use Auth;

class TitlesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->data == 'titles') {
            if (Auth::user()->type == 'ADMIN') {
                $proposal = Title::select('id', 'title', 'keywords', 'adviser', 'registration_id')->orderBy('updated_at', 'desc')->get();
                $students = User::select('name', 'title_id')->get();
                return response()->json(['proposal' => $proposal, 'students' => $students]);
            }
        }
        if (Auth::user()->type == 'ADMIN') {
            if ($request->data == '')
                return view('dashboard');
        }
        return view('student_dashboard');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $thesis = new Title;

        $thesis->fill($request->only([
            'title',
            'program',
            'adviser',
            'overview',
            'keywords',
        ]));

        $thesis->approved = false;
        $thesis->registration_id = '2020-1-TP';
        switch($request->program) {
            case 'BSCS':
            $thesis->registration_id .= 'CS';
            break;

            case 'BSIT':
            $thesis->registration_id .= 'IT';
            break;

            case 'BSEMCDA':
            $thesis->registration_id .= 'DA';
            break;

            case 'BSEMCGD':
            $thesis->registration_id .= 'GD';
            break;

            case 'BSIS':
            $thesis->registration_id .= 'IS';
            break;
        }
        $id = Title::latest('id')->first();
        $id ? $id++ : $id = 1;
        $thesis->registration_id .= '-' . $id;

        for ($i = 0; $i < count($request->students); $i++) {
            $user = new User;

            $user->student_number = $request->numbers[$i];
            $user->name = $request->students[$i];
            $user->type = 'STUDENT';
            $user->password = '12345';
            $user->title_id = $id;

            $user->save();
        }
        $thesis->save();

        return response()->json(['msg' => 'Thesis Title Proposal Added']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show()
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
