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
                $proposals = Title::select('title', 'registration_id', 'area', 'program', 'keywords', 'adviser_id')
                ->orderBy('updated_at', 'desc')->get();
                if (Auth::user()->type == 'ADMIN') {
                    foreach ($proposals as $proposal)  {
                        $students = [];
                        foreach ($proposal->users as $user)
                            array_push($students, $user->name);
                        $proposal->put('students', $students);
                        $proposal->put('adviser', User::find($proposal->adviser_id)->name);
                    }
                }
            } else if ($request->tab == 'myp') {
                if (Auth::user()->type == 'STUDENT') {
                    $proposals = Auth::user()->titles()->select('title', 'registration_id', 'area', 'program', 'keywords', 'adviser_id')
                    ->orderby('updated_at', 'desc')->get();
                    foreach ($proposals as $proposal) {
                        $students = [];
                        foreach ($proposal->users as $user)
                            array_push($students, $user->name);
                        $proposal->put('students', $students);
                        $proposal->put('adviser', User::find($proposal->adviser_id)->name);
                    }
                } else if (Auth::user()->type == 'ADVISER') {
                    $proposals = Title::select('title', 'registration_id', 'area', 'program', 'keywords')
                    ->where('adviser_id', Auth::user()->id)->orderBy('updated_at', 'desc')->get();
                    foreach ($proposals as $proposal) {
                        $students = [];
                        foreach ($proposal->users as $user)
                            array_push($students, $user->name);
                        $proposal->put('students', $students);
                        $proposal->put('adviser', Auth::user()->name);
                    }
                }
            } else {
                $proposals = Title::select('id', 'title', 'registration_id', 'area', 'program', 'keywords', 'adviser_id')
                ->where('title', '%' . $request->search . '%')
                ->orWhere('registration_id', '%' . $request->search . '%')
                ->orWhere('area', '%' . $request->search . '%')
                ->orWhere('program', '%' . $request->search . '%')
                ->orWhere('overview', '%' . $request->search . '%')
                ->orWhere('keywords', '%' . $request->search . '%')
                ->orderBy('updated_at', 'desc')->get();

                if (Auth::user()->type == 'ADMIN') {
                    foreach ($proposals as $proposal) {
                        $students = [];
                        foreach ($proposal->users as $user)
                            array_push($students, $user->name);
                        $proposal->put('students', $students);
                        $proposal->put('adviser', User::find($proposal->adviser_id)->name);
                    }

                    $user_ids = User::select('id')->where('name', 'LIKE', '%' . $request->search . '%')
                    ->orwhere('student_number', 'LIKE', '%' . $request->search . '%')
                    ->orwhere('type', 'LIKE', '%' . $request->search . '%')->get();

                    foreach ($user_ids as $user_id) {
                        $user_proposals = User::find($user_id)->titles()->select('id', 'title', 'registration_id', 'area', 'program', 'overview', 'keywords', 'adviser_id')
                        ->orderBy('updated_at', 'desc')->get();
                        foreach ($user_proposals as $proposal) {
                            if ($proposals->contains('id', $proposal->id)) continue;
                            $students = [];
                            foreach ($proposal->users as $user)
                                array_push($students, $user->name);
                            $proposal->put('students', $students);
                            $proposal->put('adviser', User::find($proposal->adviser_id)->name);
                        }
                        $proposals = $user->proposals->merge($proposals);
                    }

                    foreach ($user_ids as $user_id) {
                        $user_proposals = Title::where('adviser_id', $user_id)->orderBy('updated_at', 'desc')->get();
                        $proposals = $user_proposals->merge($proposals);
                    }
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
        ]));

        $proposal->approved = false;
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

        for ($i = 0; $i < count($request->students); $i++) {
            $user = new User;

            $user->student_number = $request->numbers[$i];
            $user->name = $request->students[$i];
            $user->type = 'STUDENT';
            $user->password = '12345';
            $user->title_id = $id;

            $user->save();
        }

        $proposal->created_at = Carbon::now('+8:00');
        $proposal->updated_at = Carbon::now('+8:00');
        $proposal->save();
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
