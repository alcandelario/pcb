<?php

class ImportedDataController extends BaseController {
	
	public function __construct()
	{
		$this->beforeFilter('serviceAuth');
		//$this->beforeFilter('serviceCSRF');
	}
	
	/**
	 * This method provides a means for processing pcb test data (i.e. like output from an AWT)
	 * which outputs html files. The application supports single file or zip file uploads for
	 * bulk processing of pcb test data files
	 *
	 * @param int $mode
	 *  	0: parse uploaded files
	 *  	1: parse a folder on or mapped to the server
	 *
	 */
	//public function pcb_test_data($mode)
	public function store()
	{
		
		//	directory to work with uploaded files
		$data_dir = app_path()."\\temp\\";
		$mode = 0;
		//  
		if($mode == 0){
			$working_dir = $this->processUploads($data_dir);     		 	// returns a file object if successful, "false" otherwise			
		}
		
		if($mode == 1 || $working_dir !== FALSE){
			if($mode == 1){
				// do stuff based on files already being on a local folder
				// not sure if this is necessary
			}
			
			// set the working directory path for our files
			$files = new DataManager($working_dir,$mode);								
			
			// iterate over our file(s) and parse accordingly 
			$complete = FALSE;
			$i = 0;
			while(!$complete){
			
				$toBeParsed = $files->fetchNextRawData(RAW_DATA_EXT);
			
				if($toBeParsed === FALSE){
					$complete = TRUE;
					$files->directoryMan(TRUE);
				}
				else{
					$fileExtractor = new DataExtractor($working_dir,$toBeParsed);
					$parsedResults = $fileExtractor->populateFileDataInTempDB();
					$files->storeParsedData($parsedResults);
				}
			}
		}
		
		// insert our files in te dB and do some cleanup if necessary
		$this->importParsedPCBData($files);
		
		if($mode == 0){		// these are temp files, to be deleted
			$success = chmod($working_dir,0777);
			$delete = new Utils();                          
			$delete->deleteDir($working_dir);
		}			
		
		// take us back to the user's profile page for now
		return Response::json(array('parse_result' => 'success'), 201);
    }
    
    private function processUploads($data_dir){
    	// retrieve our uploaded file info
    	$file = Input::file();
    	$file = $file['file'];
    	
    	// get the filetype
    	$extension = strtolower($file->getClientOriginalExtension());
    	
    	// move the uploaded files to a working directory
    	$util = new Utils();
    	$path = $util->createUniqueFolder($data_dir);
    	
    	if($path == FALSE){
    		/* failed to create working directory */
    	}
    	else{
    		$filename = $file->getClientOriginalName();
    		$file->move($path,$filename);
    	}
    		
    	// currently only support html and zip uploads
    	if(str_contains($extension,"htm")  === TRUE  ||
    	   str_contains($extension,"html") === TRUE  ||
    	   str_contains($extension,"zip")  === TRUE
    	){
    		if(str_contains($extension,"zip")){
    			$success = $util->isZipFile($path,$filename);
    			if (!$success){
    				$util->deleteDir($path);  	// get rid of the directory and error out
    				return FALSE; 				// php doesn't think this is a zip file
    			}
    		}
    		
    		return $path; 		 				// return TRUE if all file validations succeed
    	}
    	else{
    		return FALSE;				 		// file not supported
    	}
    	
    }

    private function importParsedPCBData($parsed_results_collection){
    	 
    	$files = $parsed_results_collection;
    
    	$numFiles = $files->numberOfFiles();    
    	$cnt = 0;
    
    	while($cnt < $numFiles){            	//loop thru entire collection of result filese
    		 
    		$file = $files->fetchNextParsed();
    		$cnt++;
    
    		if(!empty($file)){
    			$this->insertFile($file);
    		}
    	}
    }
    
	private function insertFile($file){

		foreach($file as $table => $data)	
    	{
	    	switch($table) {
	    		case "projects":
					$project = Project::firstOrCreate($data);
					break;
	    		
	    		case "serial_numbers":
	    			$data['project_id'] = $project->id;
	    			$serial = Serial_Number::firstOrCreate($data);
	    			break;
	    		
	    		case "test_attempts":
	    			$data['serial_number_id'] = $serial->id;
	    			$data['project_id'] = $project->id;
	    			$data["member_id"] = "1";
// 	    			$data['date'] = strtotime($data['date']);
	    			$attempt = Test_Attempt::firstOrNew($data);
	    			$exists = $attempt->exists;
	    			if(!$exists){
	    				$attempt->save();
	    			}
	    			break;
	    		
	    		case "awt_test_metadata":
	    			if(!$exists){
						$awt = new AWT_Test_Metadata($data);
						$awt->test_attempt()->associate($attempt);
						$awt->save();
	    			}	    			
	    			break;
	    		
	    		case "test_results":
	    			if(!$exists){
	    				$attemptID = $attempt->id;
	    			
		    			foreach($data as $index => $array)
		    			{
		    				$data[$index]['test_attempt_id'] = $attemptID;
		    			}
		    			DB::table('test_results')->insert($data);
	    			}
		    		break;
	    		
	    		default: 
	    			break;  // table not found
	    	}
    	}
    }
}