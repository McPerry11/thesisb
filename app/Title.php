<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;

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

	public function users() {
		return $this->belongsToMany('App\User');
	}
}
