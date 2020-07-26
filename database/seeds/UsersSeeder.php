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

    	$user->last_name = 'Research';
    	$user->first_name = 'Development';
    	$user->student_number = '20087638648';
    	$user->program = 'N/A';
    	$user->type = 'ADMIN';
    	$user->email = 'rndccss.ue@gmail.com';

    	$user->save();
    }
  }
