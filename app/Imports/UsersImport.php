<?php

namespace App\Imports;

use App\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class UsersImport implements ToCollection
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $exist = User::where('student_number', $row[1])->count();
            if ($exist == 0) {
                User::create([
                    'name' => $row[0],
                    'student_number' => $row[1],
                    'type' => 'STUDENT',
                    'password' => '12345',
                    'created_at' => Carbon::now('+8:00'),
                    'updated_at' => Carbon::now('+8:00'),
                ]);
            }
        }
    }
}
