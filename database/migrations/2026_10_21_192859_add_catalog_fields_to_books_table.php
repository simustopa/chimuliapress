<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->unsignedInteger('price')->nullable();
            $table->unsignedInteger('sold_count')->default(0);
            $table->string('availability_status')->default('ready');
            $table->boolean('is_best_seller')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn([
                'price',
                'sold_count',
                'availability_status',
                'is_best_seller',
            ]);
        });
    }

};
