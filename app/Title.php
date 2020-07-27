<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Title extends Model
{
	protected $fillable = [
		'title',
		'registration_id',
		'program',
		'adviser',
		'overview',
		'keywords'
	];
}
