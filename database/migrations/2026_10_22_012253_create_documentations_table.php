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
        Schema::create('documentations', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->text('description')->nullable();

            // Jenis dokumentasi: photo atau video
            $table->string('type', 20);

            // Lokasi file foto atau video yang diunggah
            $table->string('file_path');

            // Mengatur apakah dokumentasi ditampilkan di halaman publik
            $table->boolean('is_active')->default(true);

            // Urutan tampilan dokumentasi
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentations');
    }
};

