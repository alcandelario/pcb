<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Laravel PHP Framework</title>
	<style>
		@import url(//fonts.googleapis.com/css?family=Lato:700);

		body {
			margin:0;
			font-family:'Lato', sans-serif;
			text-align:center;
			color: #999;
		}

		.welcome {
			width: 300px;
			height: 200px;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-left: -150px;
			margin-top: -100px;
		}

		a, a:visited {
			text-decoration:none;
		}

		h1 {
			font-size: 32px;
			margin: 16px 0 0 0;
		}
	</style>
</head>
<body>
	<div class="welcome">
		
		<h1>You have arrived.</h1>

	   <br><br>
		
       <form action=<?php action('HomeController@test');?> method='POST'>
    		<div style='position: relative; border: 1px solid black; max-width: 160px;'>
		        <h4 style='text-align:center; margin: 5px 0 10px 0'>Login</h4>
		        <input type="email" name="email" placeholder="Username">
	    	    <input type="password" name="password" placeholder="Password">
    			<BR><BR>
       		 	<div style='padding: 0 0 10px 50px;'>
           			<input type="submit" value="Login">
       		 	</div>
       		</div>
       </form>
	</div>
	
</body>
</html>
