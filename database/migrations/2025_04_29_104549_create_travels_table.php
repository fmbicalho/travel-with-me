<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Create travels table first
        Schema::create('travels', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('destination');
            $table->date('start_date');
            $table->date('end_date');
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // Then create pivot table with explicit foreign keys
        Schema::create('travel_user', function (Blueprint $table) {
            $table->unsignedBigInteger('travel_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('invited_at')->useCurrent();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();

            // Create composite primary key
            $table->primary(['travel_id', 'user_id']);

            // Add foreign key constraints explicitly
            $table->foreign('travel_id')
                ->references('id')
                ->on('travels')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('travel_user');
        Schema::dropIfExists('travels');
    }
};