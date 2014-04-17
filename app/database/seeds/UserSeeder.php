<?php

class UserSeeder
extends DatabaseSeeder
{
    public function run()
    {
        $users = [
            [
                "username" => "Administrator",
                "password" => Hash::make("administrator"),
                "email"    => "admin@admin.com"
            ]
        ];
        foreach ($users as $user)
        {
            User::create($user);
        }
    }
}