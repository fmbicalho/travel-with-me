<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('travel_updates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('travel_id'); // Regular unsigned bigint first
            $table->string('title');
            $table->text('description');
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        
            // Add foreign key separately
            $table->foreign('travel_id')
                ->references('id')
                ->on('travels')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travel_updates');
    }
};
