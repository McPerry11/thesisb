<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTitlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('titles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('registration_id');
            $table->string('area');
            $table->enum('program', [
                'BSCS',
                'BSIT',
                'BSEMCDA',
                'BSEMCGD',
                'BSIS'
            ]);
            $table->foreignId('adviser_id')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->longText('overview');
            $table->longText('keywords');
            $table->boolean('approved');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('titles');
    }
}
