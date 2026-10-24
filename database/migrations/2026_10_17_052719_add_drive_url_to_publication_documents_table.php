<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('publication_documents', function (Blueprint $table) {
            $table->text('drive_url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('publication_documents', function (Blueprint $table) {
            $table->dropColumn('drive_url');
        });
    }

};
