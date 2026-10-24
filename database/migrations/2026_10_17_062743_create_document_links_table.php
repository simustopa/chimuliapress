<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('document_links', function (Blueprint $table) {
        $table->id();
        $table->string('key')->unique();
        $table->string('title');
        $table->text('url')->nullable();
        $table->timestamps();
    });
}
};
