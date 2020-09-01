<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Title;
use App\Log;
use Carbon\Carbon;
use Auth;
use Illuminate\Support\Facades\Storage;

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
                    ->orderBy('updated_at', 'desc')->paginate('10');
                    foreach ($proposals as $proposal) {
                        $proposal->students = $proposal->users()->select('name')->get();
                        $proposal->adviser = User::find($proposal->adviser_id)->name;
                        $proposal->edit = true;
                    }
                } else {
                    $proposals = Title::select('id', 'title', 'area', 'program', 'keywords')
                    ->orderBy('updated_at', 'desc')->paginate('10');
                    foreach ($proposals as $proposal)
                        $proposal->edit = false;
                }
            } else if ($request->tab == 'myp') {
                if (Auth::user()->type == 'STUDENT') {
                    $proposals = Auth::user()->titles()->select('id', 'title', 'area', 'program', 'keywords', 'adviser_id', 'registration_id')
                    ->orderBy('updated_at', 'desc')->paginate('10');
                    foreach ($proposals as $proposal)
                        $proposal->edit = false;
                } else if (Auth::user()->type == 'ADVISER') {
                    $proposals = Title::select('id', 'title', 'area', 'program', 'keywords', 'adviser_id', 'registration_id')->where('adviser_id', Auth::id())->orderBy('updated_at', 'desc')->paginate('10');
                    foreach ($proposals as $proposal)
                        $proposal->edit = false;
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
                    ->orWhereIn('adviser_id', User::select('id')->where('name', 'LIKE', '%' . $request->search . '%'))
                    ->orderBy('updated_at', 'desc')->paginate('10');
                    foreach ($proposals as $proposal) {
                        $proposal->students = $proposal->users()->select('name')->get();
                        $proposal->adviser = User::find($proposal->adviser_id)->name;
                        $proposal->edit = true;
                    }
                } else {
                    $proposals = Title::select('id', 'title', 'area', 'program', 'keywords')
                    ->where('title', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('area', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('program', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('keywords', 'LIKE', '%' . $request->search . '%')
                    ->orWhere('overview', 'LIKE', '%' . $request->search . '%')
                    ->orderBy('updated_at', 'desc')->paginate('10');
                }
            } 
            return response()->json(['proposals' => $proposals]);
        } else if ($request->data == 'validate') {
            $existing = Title::where('title', $request->title)->count();
            if ($existing > 0) {
                return response()->json(['status' => 'error']);
            } else {
                $words = explode(' ' , $request->title);
                $proposals = Title::all();
                foreach ($proposals as $proposal) {
                    $difference = count(array_diff($words, explode(' ', preg_replace("/[^A-Za-z0-9' -]/", '', $proposal->title))));
                    if ($difference == 0)
                        return response()->json(['status' => 'error']);
                }
                return response()->json(['status' => 'validated']);
            }
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
        if (Auth::user()->type == 'ADMIN') {
            $proposal = new Title;

            $proposal->title = strip_tags($request->title);
            $proposal->area = strip_tags($request->area);
            $proposal->program = strip_tags($request->program);
            $proposal->overview = strip_tags($request->overview);
            $proposal->keywords = strip_tags($request->keywords);
            $proposal->created_at = strip_tags($request->created_at);
            $proposal->adviser_id = strip_tags($request->adviser_id);

            if (Carbon::parse($proposal->created_at)->year >= 2020) {
                $proposal->registration_id = Carbon::now('+8:00')->year . '-1-TP';
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

                $id = Title::where('program', $proposal->program)->whereYear('created_at', Carbon::now('+8:00')->year)->count() + 1;
                $proposal->registration_id .= '-' . $id;

                if ($request->file !== 'undefined') {
                    $proposal->filename = $proposal->registration_id . '.' . $request->file->getClientOriginalExtension();
                    $request->file->move(storage_path('app/public/uploads'), $proposal->filename);
                }
            }

            $proposal->updated_at = Carbon::now('+8:00');
            $proposal->save();

            $request->numbers = explode(',', $request->numbers);
            $students = User::whereIn('student_number', $request->numbers)->get();
            $student_numbers = [];
            foreach ($students as $student)
                array_push($student_numbers, $student->id);
            $proposal->users()->sync($student_numbers);

            Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' added a new proposal: ' . $proposal->title . '.', 'created_at' => Carbon::now('+8:00')]);

            return response()->json(['msg' => 'Thesis Title Proposal Added']);
        }
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
            $owner = Title::find($id)->users()->where('id', Auth::id())->count();
            $adviser = Title::where('adviser_id', Auth::id())->find($id);
            if (Auth::user()->type == 'ADMIN') {
                $proposal = Title::select('id', 'title', 'area', 'program', 'keywords', 'overview', 'adviser_id', 'filename', 'created_at')->find($id);
            } else if ($owner > 0 || $adviser) {
                $proposal = Title::select('id', 'title', 'area', 'program', 'keywords', 'overview', 'filename', 'created_at')->find($id);
            } else {
                $proposal = Title::select('id', 'title', 'area', 'program', 'keywords', 'overview', 'created_at')->find($id);
            }
            return response()->json(['proposal' => $proposal]);
        }
        return Title::select('title')->find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if (Auth::user()->type == 'ADMIN') {
            $proposal = Title::find($id);
            $advisers = User::select('id', 'name')->where('type', 'ADVISER')->get();
            return response()->json(['proposal' => $proposal, 'advisers' => $advisers]);
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
            $proposal = Title::find($id);

            $proposal->title = strip_tags($request->title);
            $proposal->area = strip_tags($request->area);
            $proposal->program = strip_tags($request->program);
            $proposal->overview = strip_tags($request->overview);
            $proposal->keywords = strip_tags($request->keywords);
            $proposal->created_at = strip_tags($request->created_at);
            $proposal->adviser_id = strip_tags($request->adviser_id);
            $proposal->updated_at = Carbon::now('+8:00');

            if ($request->file !== 'undefined') {
                Storage::disk('public')->delete('uploads/' . $proposal->filename);
                $proposal->filename = $proposal->registration_id . '.' . $request->file->getClientOriginalExtension();
                $request->file->move(storage_path('app/public/uploads'), $proposal->filename);
            }

            $proposal->save();
            Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' updated a proposal: ' . $proposal->title . '.', 'created_at' => Carbon::now('+8:00')]);

            return response()->json(['msg' => $proposal->title . ' has been updated']);
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
            $proposal = Title::find($id);

            Log::create(['user_id' => Auth::id(), 'description' => Auth::user()->name . ' deleted a proposal: ' . $proposal->title . '.', 'created_at' => Carbon::now('+8:00')]);
            Storage::disk('public')->delete('uploads/' . $proposal->filename);
            $proposal->delete();

            return response()->json(['status' => 'success']);
        }
    }

    public function download($id) {
        $proposal = Title::find($id);
        return Storage::disk('public')->download('uploads/' . $proposal->filename);
    }
}
