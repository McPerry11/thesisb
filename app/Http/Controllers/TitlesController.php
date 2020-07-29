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
            if ($request->search == '' && $request->tab == 'all') {
                $proposal = Title::select('id', 'title', 'area', 'program', 'keywords', 'adviser', 'registration_id')->orderBy('updated_at', 'desc')->get();
                if (Auth::user()->type == 'ADMIN') {
                    $students = User::select('name', 'title_id')->get();
                    return response()->json(['proposal' => $proposal, 'students' => $students]);
                }
            } else if ($request->tab == 'per') {
		$students = User::select('title_id')->where('student_number', Auth::user()->student_number)->get();
		$stid = array();
		foreach ($students as $student)
		    array_push($stid, $student->title_id);
                $proposal = Title::select('id', 'title', 'area', 'program', 'keywords', 'adviser', 'registration_id')
		    ->whereIn('id', $stid)
		    ->orderBy('updated_at', 'desc')->get();
            } else {
                $students = User::select('title_id')
                ->where('name', 'LIKE', '%' . $request->search . '%')
                ->orWhere('student_number', 'LIKE', '%' . $request->search . '%')->get();
		$stid = array();
		foreach ($students as $student)
		    array_push($stid, $student->title_id);
                $proposal = Title::select('id', 'title', 'area', 'program', 'keywords', 'adviser', 'registration_id')
                ->where('title', 'LIKE', '%' . $request->search . '%')
                ->orWhere('area', 'LIKE', '%' . $request->search . '%')
                ->orWhere('program', 'LIKE', '%' . $request->search . '%')
                ->orWhere('keywords', 'LIKE', '%' . $request->search . '%')
                ->orWhere('adviser', 'LIKE', '%' . $request->search . '%')
                ->orWhere('overview', 'LIKE', '%' . $request->search . '%')
                ->orWhere('registration_id', 'LIKE', '%' . $request->search . '%')
                ->orWhereIn('id', $stid)
                ->orderBy('updated_at', 'desc')->get();
            }
	    return response()->json(['proposal' => $proposal]);
        }
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
            'area',
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
        $id = Title::latest('id')->value('id');
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
    public function show(Request $request, $id)
    {
        if ($request->data == 'view') {
	    $exist = User::select('student_number')->where([
		['title_id', $id],
		['student_number', Auth::user()->student_number],
  	    ])->get();
	    $proposal = Title::find($id);
            if (Auth::user()->type == 'ADMIN' || count($exist) > 0) {
                $proposal = Title::find($id);
                $students = User::select('name')->where('title_id', $id)->get();
                return response()->json(['proposal' => $proposal, 'students' => $students]);
            }
            return response()->json(['status' => 'limited', 'proposal' => $proposal]);
        }
        return Title::select('id', 'title')->find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return Title::find($id);
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
        $proposal = Title::find($id);

        $proposal->fill($request->only([
            'title',
            'area',
            'program',
            'adviser',
            'overview',
            'keywords'
        ]));

        $proposal->save();

        return response()->json(['msg' => $proposal->title . ' has been updated']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $title = Title::find($id);

        $title->delete();

        $students = User::where('title_id', $id)->get();
        foreach($students as $student)
            $student->delete();

        return response()->json(['status' => 'success']);
    }
}
