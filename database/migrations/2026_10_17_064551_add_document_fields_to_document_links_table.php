<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('document_links', function (Blueprint $table) {
            $table->string('key')->nullable()->unique();
            $table->string('title')->nullable();
            $table->text('url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('document_links', function (Blueprint $table) {
            $table->dropUnique(['key']);
            $table->dropColumn(['key', 'title', 'url']);
        });
    }

};
