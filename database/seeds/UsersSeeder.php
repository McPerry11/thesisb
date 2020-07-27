<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	$user = new USer();

    	$user->name = 'Research & Development';
    	$user->student_number = '20087638648';
    	$user->password = '12345';
    	$user->type = 'ADMIN';

    	$user->save();
    }
  }
