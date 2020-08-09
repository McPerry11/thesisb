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
    	$user = new User;

    	$user->name = 'Research & Development';
    	$user->student_number = 'RND2008';
    	$user->password = '12345';
    	$user->type = 'ADMIN';

        $user->save();
    }
}
