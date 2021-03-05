<?php

namespace App\Exports;

use App\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class UsersExport implements FromCollection, ShouldAutoSize
{
  /**
  * @return \Illuminate\Support\Collection
  */
  public function collection()
  {
  	return User::select('student_number', 'name', 'type')->get();
  }
}
