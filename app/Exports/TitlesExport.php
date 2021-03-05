<?php

namespace App\Exports;

use App\Title;
use App\User;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TitlesExport implements FromArray, ShouldAutoSize
{
  /**
  * @return \Illuminate\Support\Collection
  */
  public function array(): array
  {
  	$titles = Title::all();

  	$data = array();
  	foreach ($titles as $title) {
  		$row = array($title->title, $title->registration_id, $title->area, $title->program);


  		$userscol = array(User::where('id', $title->adviser_id)->pluck('student_number')[0]);

  		$users = $title->users()->pluck('student_number');
  		foreach ($users as $user)
  			array_push($userscol, $user);

  		$users = implode(', ', $userscol);
  		array_push($row, $users, $title->overview, $title->keywords, $title->status);
  		array_push($data, $row);
  	}

  	return $data;
  }
}
