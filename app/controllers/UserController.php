<?php

use Illuminate\Support\MessageBag;

class UserController extends BaseController {

	public function profile()
	{
	    return View::make("user/profile");
	}

	
	public function store()  // "store()" maps to POST /resource. Used for logging in
	{
            $validator = Validator::make(Input::all(), [
                "email"    => "required",
                "password" => "required"
            ]);
            
            if ($validator->passes())
            {
                $credentials = [
                    "email" => Input::get("email"),
                    "password" => Input::get("password")
                ];
                if (Auth::attempt($credentials))
                {
                   
                   // send angularJS a JSON object with user data
                   $resp = Response::json(['user' => Auth::user()->toArray()],202);
                   return $resp;
                }
                else {
            		$resp = Response::json(['flash' => 'Authentication failed'],401);
            		return $resp;
            	}
            }
    }
	
    public function index()  	// "index()" maps to GET /resource (use to logout)
    {
    	Auth::logout();
    	//return Redirect::route("user/login");
    	return Response::json(['flash' => 'You are logged out'],200);
    	
    }
    
    public function create() 	//"create()" maps to GET /resource/create
    {
    	
    }
    
    public function show($id) 	//"show()" maps to GET /resource/{id}
    {
    	
    }
    
    public function edit($id)	//"edit()" maps to GET /resource/{id}/edit
    {
    	
    }
    
    public function update($id) //"update()" maps to PUT /resource/{id}
    {
    	
    }
    
    public function destroy($id) //"destroy()" maps to DELETE /resource/{id}
    {
    	
    }
    
    public function resetPasswordRequest()
	{
		$data = [
		"requested" => Input::old("requested")
		];
		if (Input::server("REQUEST_METHOD") == "POST")
		{
			$validator = Validator::make(Input::all(), [
					"email" => "required"
					]);
			if ($validator->passes())
			{
				$credentials = [
				"email" => Input::get("email")
				];
				Password::remind($credentials,
				function($message, $user)
				{
					$message->from("chris@example.com");
				}
				);
				$data["requested"] = true;
				return Redirect::route("user/request")
				->withInput($data);
			}
		}
		return View::make("user/request", $data);
	}

	public function resetPassword()
	{
		$token = "?token=" . Input::get("token");
		$errors = new MessageBag();
		if ($old = Input::old("errors"))
		{
			$errors = $old;
		}
		$data = [
		"token"  => $token,
		"errors" => $errors
		];
		if (Input::server("REQUEST_METHOD") == "POST")
		{
			$validator = Validator::make(Input::all(), [
					"email"                 => "required|email",
					"password"              => "required|min:6",
					"password_confirmation" => "same:password",
					"token"                 => "exists:token,token"
					]);
			if ($validator->passes())
			{
				$credentials = [
				"email" => Input::get("email")
				];
				
				Password::reset($credentials,
				function($user, $password)
				{
					$user->password = Hash::make($password);
					$user->save();
					Auth::login($user);
					return Redirect::route("user/profile");
				}
				);
			}
			
			$data["email"] = Input::get("email");
			$data["errors"] = $validator->errors();
			return Redirect::to(URL::route("user/reset") . $token)
			->withInput($data);
		}
		return View::make("user/reset", $data);
	}
}