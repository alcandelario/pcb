<?php
class TestResultController extends BaseController {

	public function __construct()
	{
		$this->beforeFilter('serviceAuth');
		//$this->beforeFilter('serviceCSRF');
	}
	
	public function show($id){
		//$results = Test_Attempt::with('awt_test_metadata','test_result')->find($id);
		
		$results = DB::table("test_attempts")
						->join('awt_test_metadata', 'test_attempts.id','=','awt_test_metadata.test_attempt_id')
						->join('test_results','test_attempts.id','=','test_results.test_attempt_id')
						->join('test_names', 'test_results.test_name_id','=','test_names.id')
						->where("test_attempts.id",'=',$id)
						->get();

		return Response::json($results,201);

	}

	public function printLabels(){
		$params = Input::all();
		$serials = $params['serials'];
		$tests = $params['tests'];

		$index = 1;
		// build the where clause for serial number related queries
		foreach ($serials as $serialID)
		{
			if($index === 1)
			{
				$serial_where = 'serial_numbers.id = '.$serialID;
				$attempt_where = 'test_attempts.serial_number_id = '.$serialID;
				$index++;
			}
			else
			{
				$serial_where = $serial_where." OR serial_numbers.id = ".$serialID;
				$attempt_where = $attempt_where.'OR test_attempts.serial_number_id = '.$serialID;
			}
		}

		$index = 1;
		// build the where clause for test data related query
		foreach ($tests as $testID){
			if($index === 1){
				$test_where = 'test_names.id = '.$testID;
				$index++;
			}
			else{
				$test_where = $test_where." OR test_names.id = ".$testID;
			}
		}
		// limit our test data search to the latest attempt that passed
		$query = 'SELECT DISTINCT ON (test_attempts.serial_number_id) 
						test_attempts.id 
						from test_attempts 
						WHERE '.$attempt_where.' AND test_attempts.final_result LIKE \'Pass\'';
		
		$results = DB::select( DB::raw($query) );
		
		$index= 1;
		// build the where clause for test data related query
		foreach($results as $key => $value){
		if($index === 1)
			{
				$attempt_where = 'test_attempts.id = '.$value->id;
				$index++;
			}
			else
			{
				$attempt_where = $attempt_where.' OR test_attempts.id = '.$value->id;
			} 
		}
		// get the specific test result data for a specific group of serial numbers when they
		// were last tested and passed all tests
		$query = 'SELECT
		 				date, serial_numbers.id, test_attempts.id,
		 				final_result, serial_numbers.pcb, test_name, actual, units,test_attempts.serial_number_id
		 			FROM  test_attempts
		 			INNER JOIN test_results ON test_attempts.id = test_results.test_attempt_id
					INNER JOIN (SELECT * FROM test_names WHERE '.$test_where.') test_names
		 						ON test_results.test_name_id = test_names.id
		 			INNER JOIN (SELECT * FROM serial_numbers WHERE '.$serial_where.') serial_numbers
		 					   ON test_attempts.serial_number_id = serial_numbers.id
		 			WHERE '.$attempt_where;
		
		 $results = DB::select( DB::raw($query) );

		 return Response::json($results,201);
	}

	public function chartTestLimits(){
		$params = Input::all();
		
		// sometimes we want to chart data for an entire project
		// worth of AWT test limits or sometimes just for a single
		// serial number
		$query = 'SELECT test_attempts.id,date,final_result,pcb,test_name,min,max,actual,units,result FROM test_attempts 
					INNER JOIN test_results ON test_attempts.id = test_results.test_attempt_id
					INNER JOIN test_names ON test_results.test_name_id = test_names.id
					INNER JOIN serial_numbers ON test_attempts.serial_number_id = serial_numbers.id
					WHERE test_attempts.project_id = '.$params['projectID'].' ';


		if(!strcmp($params['serialID'],'all')){
			// do nothing
		}
		else {
			// add the serial number clause for charting an individual unit's data
			$query = $query.'AND test_attempts.serial_number_id = '.$params['serialID'];
		}

		// build the rest of the query and add the ORDER clause
		$query = $query.' ORDER BY test_name';
		
		$results = DB::select( DB::raw($query) );
		
		Session::put('test_results_data',$results);
		
		return Response::json($results,201);
	}
	/**
	 *	Save chart data to an excel file	
	 *
	 */
	public function saveExcel(){
		$title = 'AWT-test-data_'.date("mdy_Hi");

		$excel = Excel::create($title, function($excel) {

        		// get our most recent data
				$results = Session::get('test_results_data');
        		$title = 'AWT-test-data_'.date("mdy_Hi");

        		$excel->getProperties()
        		      ->setCreator("PHPExcel")
                	  ->setTitle($title)
                	  ->setDescription("AWT Test Data generated using phpExcel");

                // where do we want raw data to start being populated in the worksheet
       			$colStart = 'B';
          		$rowStart =  6;
          		$sheetIndex = 0;
          		$prevSheetTitle = null;
          		
          		foreach($results as $index => $result){
          			$sheetTitle = $result->test_name;

          			//shorten the name
					$sheetTitle = substr($sheetTitle,0,30);
					
					if($prevSheetTitle === null){
						$init = false;	// initialize the very first sheet
						$prevSheetTitle = $sheetTitle;
					}
					elseif(strcmp($sheetTitle, $prevSheetTitle) !== 0){
						// initialize a new sheet
						$sheetIndex++;
						$init = false;
						$prevSheetTitle = $sheetTitle;
					}

	          		if($init === false){
	          			// get the min/max
	          			$lowLim = $result->min;
	          			$upLim = $result->max;
	          			
          		  		$sheet = $excel->sheet($sheetTitle, function($sheet) {return $sheet;});
		          	  		// name the worksheet and add the column labels
		          	  		$sheet->setActiveSheetIndex($sheetIndex)
					                ->setCellValue('A5',$sheetTitle)
					                ->setCellValue('B5',"Unit Serial Number")
					                ->setCellValue('C5',"Date Tested")
					                ->setCellValue('D5',"Result")
				       		// add this test's lower limit to the top of the "Actual Value" column         
					                ->setCellValue('B1',$lowLim)
					                ->setCellValue('A1',"Lower Limit")
					                ->setCellValue('B2',$upLim)
					                ->setCellValue('A2',"Upper Limit");
	
		          	  		// format the header row  a bit
		          	  		$style = array('font' => array('bold' => true, 'size' => 12,'italic' => true));
		          	  		 
					       // $sheet->getActiveSheet()->getStyle('A6:D6')->setStyle($style);                
	        				
	        				$sheet->cells('A5:D5')->setStyle($style);

    	      			    $rowIndex = $rowStart; //default row at which data gets written
							
							$init = true;
          			}	
					
          		  	//insert a row of data
          			$colIndex = $colStart;
          		  	for($i=0; $i<3; $i++)
					{
					  	$cell = $colIndex.$rowIndex;
	          		  	switch ($i){
	          		  		case 0: 
	          		  			$cellValue = $result->pcb;
	          		  			break;
	          		  		case 1:
	          		  			$cellValue = $result->date;
	          		  			break;
	          		  		case 2:
	          		  			$cellValue = $result->actual;
	          		  			break;
	          		  	}

	          			$excel->setActiveSheetIndex($sheetIndex)
	                   		  ->setCellValue($cell,$cellValue);
	               		
	          			$colIndex++;
	               	}

	               	$rowIndex++;
				}
				$excel->setActiveSheetIndex(0);

			})->store('xls','app/storage/exports/', true);

			$file = url("app/storage/exports/".$excel['file']);
// 			$url = link_to($file,$excel['file']);
			
			return Response::json($file,201);
			
   		}
}