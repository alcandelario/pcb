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
		
		$excel = Excel::create('Laravel Excel', function($excel) {

        		// get our most recent data
				$results = Session::get('test_results_data');
        
        		$excel->getProperties()
        		      ->setCreator("PHPExcel")
                	  ->setTitle("AWT_Test_Data")
                	  ->setDescription("AWT Test Data generated using phpExcel");

                // where do we want raw data to start being populated in the worksheet
       			$colStart = 'B';
          		$rowStart = 7;
          		$sheetIndex = 0;
          		$prevSheetTitle = null;
          		
          		foreach($results as $index => $result){
          			$sheetTitle = $result->test_name;

          			//short the name
					$sheetTitle = substr($sheetTitle,0,30);
					
					if($prevSheetTitle === null){
						$init = false;	// need to initialize this sheet with a header
						$prevSheetTitle = $sheetTitle;
					}
					elseif(strcmp($sheetTitle, $prevSheetTitle) !== 0){
						// we've got a new sheet
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
					                // ->setTitle($sheetTitle)
					                ->setCellValue('A1',$sheetTitle)
					                ->setCellValue('B6',"Unit Serial Number")
					                ->setCellValue('C6',"Date Tested")
					                ->setCellValue('D6',"Result")
				       		// add this test's lower limit to the top of the "Actual Value" column         
					                ->setCellValue('B3',$lowLim)
					                ->setCellValue('A3',"Lower Limit")
					                ->setCellValue('B4',$upLim)
					                ->setCellValue('A4',"Upper Limit");
	
					        // format the header row  a bit
	    		   			$style = array('font' => array('bold' => true, 'size' => 12,'italic' => true));
        			
	   //     				$sheet->getActiveSheet()->getStyleArray('A1:D1')->applyFromArray($style);                
    	      			    $rowIndex = $rowStart;
							$init = true;
          			}	
					
          		  	//insert one row
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
			})->store('xls',false, true);

			$file = url("app/storage/exports/".$excel['file']);
			$url = link_to($file,$excel['file']);
			
			return Response::json($url,201);
			
   		}
}