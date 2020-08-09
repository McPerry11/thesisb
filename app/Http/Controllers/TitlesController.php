<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Title;
use App\Log;
use Carbon\Carbon;
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
                if (Auth::user()->type == 'ADMIN') {
                    $proposals = Title::select('id', 'title', 'area', 'program', 'keywords', 'adviser_id', 'registration_id')
                    ->orderBy('updated_at', 'desc')->get();
                    foreach ($proposals as $proposal) {
                        $proposal->students = $proposal->users()->select('name')->get();
                        $proposal->adviser = User::find($proposal->adviser_id)->name;
                        $proposal->edit = true;
                    }
                } else {
                    $proposals = Title::select('id', 'title', 'area', 'program', 'keywords')
                    ->orderBy('updated_at', 'desc')->get();
                    foreach ($proposals as $proposal)
                        $proposal->edit = false;
                }
            } else if ($request->tab == 'myp') {
                if (Auth::user()->type == 'STUDENT') {
                    $proposals = Auth::user()->titles()->select('id', 'title', 'area', 'program', 'keywords', 'adviser_id', 'registration_id')
                    ->orderBy('updated_at', 'desc')->get();
                    foreach ($proposals as $proposal) {
                        $proposal->students = $proposal->users()->select('name')->get();
                        $proposal->adviser = User::find($proposal->adviser_id)->name;
                        $proposal->edit = false;
                    }
                } else if (Auth::user()->type == 'ADVISER') {
                    $proposals = Title::select('id', 'title', 'area', 'program', 'keywords', 'adviser_id', 'registration_id')->where('adviser_id', Auth::id())->orderBy('updated_at', 'desc')->get();
                    foreach ($proposals as $proposal) {
                        $proposal->students = $proposal->users()->select('name')->get();
                        $proposal->adviser = Auth::user()->name;
                        $proposal->edit = false;
                    }
                }   
            } else {
                if (Auth::user()->type == 'ADMIN') {
                    $proposals = Title::select('id', 'title', 'area', 'program', 'keywords', 'adviser_id', 'registration_id')
                    ->where('title', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('area', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('program', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('keywords', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('overview', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('registration_id', 'LIKE', '%' . $request->search . '%')
                    ->orderBy('updated_at', 'desc')->get();
                    foreach ($proposals as $proposal) {
                        $proposal->students = $proposal->users()->select('name')->get();
                        $proposal->adviser = User::find($proposal->adviser_id)->name;
                    }

                    $students = User::select('id', 'name')
                    ->where('name', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('student_number', 'LIKE', '%' . $request->search . '%')
                    ->orderBy('updated_at', 'desc')->get();
                    foreach ($students as $student) {
                        $student_proposals = $student->titles()->select('id', 'title', 'area', 'program', 'keywords', 'adviser_id', 'registration_id')
                        ->orderBy('updated_at', 'desc')->get();
                        foreach ($student_proposals as $proposal) {
                            $proposal->students = $proposal->users()->select('name')->get();
                            $proposal->adviser = User::find($proposal->adviser_id)->name;
                        }
                        $proposals = $student_proposals->merge($proposals);
                    }

                    $advisers = User::select('id', 'name')
                    ->where('name', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('student_number', 'LIKE', '%' . $request->search . '%')
                    ->orderBy('updated_at', 'desc')->get();
                    foreach ($advisers as $adviser) {
                        $adviser_proposals = Title::where('adviser_id', $adviser->id)->orderBy('updated_at', 'desc')->get();
                        foreach ($adviser_proposals as $proposal) {
                            $proposal->students = $proposal->users()->select('name')->get();
                            $proposal->adviser = User::find($proposal->adviser_id)->name;
                        }
                        $proposals = $adviser_proposals->merge($proposals);
                    }

                    foreach ($proposals as $proposal) {
                        $proposal->edit = true;
                    }
                } else {
                    $proposals = Title::select('id', 'title', 'area', 'program', 'keywords')
                    ->where('title', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('area', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('program', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('keywords', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('overview', 'LIKE', '%' . $request->search . '%')
                    ->orderBy('updated_at', 'desc')->get();
                }
            } 
            return response()->json(['proposals' => $proposals]);
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
        $proposal = new Title;

        $proposal->fill($request->only([
            'title',
            'area',
            'program',
            'overview',
            'keywords',
            'created_at'
        ]));

        $proposal->adviser_id = $request->adviser_id;
        $proposal->registration_id = '2020-1-TP';
        switch($request->program) {
            case 'BSCS':
            $proposal->registration_id .= 'CS';
            break;

            case 'BSIT':
            $proposal->registration_id .= 'IT';
            break;

            case 'BSEMCDA':
            $proposal->registration_id .= 'DA';
            break;

            case 'BSEMCGD':
            $proposal->registration_id .= 'GD';
            break;

            case 'BSIS':
            $proposal->registration_id .= 'IS';
            break;
        }
        $id = Title::latest('id')->value('id');
        $id ? $id++ : $id = 1;
        $proposal->registration_id .= '-' . $id;

        $proposal->updated_at = Carbon::now('+8:00');
        $proposal->save();

        $students = User::whereIn('student_number', $request->numbers)->get();
        $student_numbers = [];
        foreach ($students as $student)
            array_push($student_numbers, $student->id);
        $proposal->users()->sync($student_numbers);

        Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' added a new proposal: ' . $proposal->title . '.', 'created_at' => Carbon::now('+8:00')]);

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
            $owner = Auth::user()->titles()->where('id', $id)->count();
            $adviser = Title::where('adviser_id', Auth::id())->where('id', $id)->count();
            if (Auth::user()->type == 'ADMIN' || $owner > 0 || $adviser > 0) {
                $proposal = Title::select('id', 'title', 'area', 'program', 'keywords', 'overview', 'adviser_id', 'created_at')->find($id);
                $proposal->students = $proposal->users()->select('name')->get();
                $proposal->adviser = User::find($proposal->adviser_id)->name;
            } else {
                $proposal = Title::select('id', 'title', 'area', 'program', 'keywords', 'overview', 'created_at')->find($id);
            }
            return response()->json(['proposal' => $proposal]);
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

        $proposal->updated_at = Carbon::now('+8:00');
        $proposal->save();
        Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' updated a proposal: ' . $proposal->title . '.', 'created_at' => Carbon::now('+8:00')]);

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
        $proposal = Title::find($id);

        Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' deleted a proposal: ' . $proposal->title . '.', 'created_at' => Carbon::now('+8:00')]);
        $proposal->delete();

        return response()->json(['status' => 'success']);
    }
}
