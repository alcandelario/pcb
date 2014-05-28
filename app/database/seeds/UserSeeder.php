<?php

class UserSeeder
extends DatabaseSeeder
{
    public function run()
    {
        $users = [
            [
                "id"       => 1,
                "username" => "Administrator",
                "password" => Hash::make("administrator"),
                "email"    => "admin@admin.com",
                "admin"    => true
            ],
            [   "id"       => 2,
                "username" => "RegularUser",
                "password" => Hash::make("regularuser"),
                "email"    => "regular@user.com",
                "admin"    => false
            ],

        ];
        
        foreach ($users as $user)
        {
            User::create($user);
        }

        $members = [
                [
                    "user_id"    => 1,
                    "position"   => "The Admin",
                    "firstname"  => "Major",
                    "lastname"   => "Payne",
                    "ph_work"    => "7731234567",
                    "ph_home"    => "+1 0 8909098 0",
                    "email_work" => "major@army.com",
                    "email_home" => "payne@intheass.com",
                    "active"     => true,
                    "can_invite" => true,
                    "is_cleared" => true
                ],
                [  
                    "user_id"    => 2,
                    "position"   => "Ordinary User",
                    "firstname"  => "Jose",
                    "lastname"   => "Schmoezay",
                    "ph_work"    => "7731234567",
                    "ph_home"    => "+1 0 8909098 0",
                    "email_work" => "joser44@gmail.com",
                    "email_home" => "moezaymbique@gmail.com",
                    "active"     => true,
                    "can_invite" => false,
                    "is_cleared" => false
                ]
        ];

        foreach ($members as $member)
        {
            Member::create($member);
        }
    }
}