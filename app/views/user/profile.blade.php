@extends("layout")
@section("content")
<h2>Hello</h2> 
<h1> {{ Auth::user()->username }}</h1>
<p>Welcome to your sparse profile page.</p>

<?php  
	 $params = '0';  // 0: user is uploading this data themself, versus the data 
	       			 // already being on a server-accessible folder
		       				    
	 $url1 = action('ImportedDataController@pcb_test_data', $params);
	 $url2 = action('ImportedDataController@pcb_test_data', 1)
			   
?>
	<br><br>
		
		<form action=<?=$url1;?> method = 'POST' enctype="multipart/form-data">
    		<div style='position: relative; border: 1px solid black; max-width: 160px;'>
	        	<h4 style='text-align:center; margin: 5px 0 10px 0'>Import AWT Test Data</h4>
	        	<input type="hidden" name="MAX_FILE_SIZE" value="4194304" />
	        	<input type="file" name="files[]" value='fileToImport'>
    			<BR><BR>
       		 	
       		 	<div style='padding: 0 0 10px 50px;'>
           			<input type="submit" value="Import">
       		 	</div>
       		 	
       		 	<div>
       		 		<button style='margin-left: 5px; margin-right: 5px;'><a href='<?=$url2?>'>Import new data already on the server</a></button>
       		 	</div>
   			</div>
       </form>

@stop
