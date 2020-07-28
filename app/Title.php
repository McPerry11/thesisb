<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Title extends Model
{
	protected $fillable = [
		'title',
		'area',
		'registration_id',
		'program',
		'adviser',
		'overview',
		'keywords'
	];
}
