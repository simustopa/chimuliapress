<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrator',
                'email' => 'admin@penerbit.test',
                'password' => 'Admin123!',
                'role' => 'admin',
            ],
            [
                'name' => 'Editor Penerbit',
                'email' => 'editor@penerbit.test',
                'password' => 'Editor123!',
                'role' => 'editor',
            ],
            [
                'name' => 'Penulis Contoh',
                'email' => 'author@penerbit.test',
                'password' => 'Author123!',
                'role' => 'author',
            ],
        ];

        foreach ($users as $data) {
            $role = Role::where('slug', $data['role'])->firstOrFail();

            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => $data['password'],
                    'role_id' => $role->id,
                ]
            );

            // Agar akun bisa membuka dashboard yang memakai middleware "verified".
            $user->forceFill([
                'email_verified_at' => now(),
            ])->save();
        }
    }
}
