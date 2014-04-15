<?php

/************************************************************************************
 * The purpose of this class is to search an html file
 * based on a certain type of search criteria. This class will then search the
 * document with that information and return results in array(s).  They should
 * basically be viewed as temp dB tables that will be parsed and eventually inserted
 * into an actual dB
 ************************************************************************************/
class DataExtractor {

    public function __construct($filepath,$filename) {
        
    	$this->filepath = $filepath;        //don't actually open the file just yet
        $this->filename = $filename;        //just build the filepath
        $this->file = $this->filepath."\\".$this->filename;

        // grab the parser instructions file
        require PARSER_CONFIG; 
        $this->inputArray = $parser_config_array;     
    }

    public function populateFileDataInTempDB(){
    	$this->numHeadings = 0;
        $this->searchStyle = "";

        $this->filepath = @opendir($this->filepath);    //open the directory

        if($this->filepath) {    //did we open it successfully?
                foreach ($this->inputArray as $key => $this->innerArray){ //extract an individual array from the container array
                    $this->searchStyle = $this->getSearchStyle($this->innerArray);

                    $this->numHeadings = count($this->innerArray) - 1;      //number of db Headers in array minus the keyword search array element
                    
                    
                    // call the appropriate search algorithm
                    switch ($this->searchStyle){
                        
                    	case KEYWORD_PARSE:
                            $resultsFile = fopen($this->file,"r");  //open the file anew
                            $this->populateArrayByKeyword($resultsFile,$this->innerArray,$this->numHeadings);
                            $this->inputArray[$key] = $this->innerArray; //update the input array with the inner array data
                            fclose($resultsFile);
                            break;

                        case HTML_PARSE:
                             $return = $this->populateArrayByHTMLtags($this->file,$this->innerArray,$this->numHeadings);
                             $this->inputArray[$key] = $return;  // an array formatted to insert into db using Laravel's method
                             break;

                        default:
                            echo "Couldn't find an appropriate search style in fileDataExtractor class";
                            break;
                    }
                }
                    return $this->inputArray;
        }
        else {
            echo "The fileDataExtractor OBJECT apparently had trouble opening the directory to the file";
        }
    }

    public function getSearchStyle($array){
    	
    	 // the first key/value pair in the array is the search style
    	 foreach($array as $key => $value){

            if(strpos($value,KEYWORD_PARSE) !== FALSE){
	            return KEYWORD_PARSE;
            }
            else {
            	return HTML_PARSE;
            }
        }
    }

    public function extractionComplete(){
        closedir($this->filepath);
        return;
    }

    private function populateArrayByKeyword($resultsFile,$innerArray,$numHeadings){
        $i=0;
        
        // unset the first element in the array, don't need it anymore
        foreach ($this->innerArray as $key => $value){
        	unset($this->innerArray[$key]);
        	break;
        }
        
        while(!feof($resultsFile)){
            $line=fgets($resultsFile);  //***grab a new line from the file***

            if($i < $numHeadings) {    //run this ONLY as long as we need to
                
            	foreach($innerArray as $key=>$value) {      				//compare line to all db column names

                	if(strpos($line,$value) !== false) {                 	//does the line have that text in it?
                    	$line = strip_tags($line);                          //remove HTML
                        $line = str_replace($value,'',$line);            	//remove keyword
                        $line = preg_replace('/[^A-Za-z0-9.]/x'," ",$line); //strip special chars
                        $line = trim($line);                                //remove leading/trailing spaces
                        $line = preg_replace('#[\s]+#', ' ', $line);        //replace double space with single space
                        
                        // convert any dates to date format for easy dB insertion
                		if(stripos($key,"date") !==FALSE){
                			$line = $this->convertToDATETIME($line);
                		}
                        
                        $this->innerArray[$key]=$line;
                        $i++;
                        break;
                   }
                }
            }
            else {
             	return;
            }     
        }
    }

    private function populateArrayByHTMLtags($resultsFile,$innerArray,$numHeadings){
    	
    	// unset the first element in the array, don't need it anymore
    	foreach ($this->innerArray as $key => $value){
    		unset($this->innerArray[$key]);
    		break;
    	}
        
        // Process the rest of the data using the DOMDocument Class
        // Start putting results data into arrays

        $dom = new DOMDocument();    //create an instance of DOMDocument
        $success = @$dom->loadHTMLFile($resultsFile);
        $tag = $this->getHTMLtag($innerArray);

        //Grab all text data inside for example, <TD> </TD> tags. $testData is an array where results are stored
        $testData = $dom->getElementsByTagName($tag);
        $this->counter = $testData->length;

       if($this->counter == 0){  //html tags may have been in uppercase
                    $tag = strtolower($tag);
               $testData = $dom->getElementsByTagName($tag); //try again
          $this->counter = $testData->length;
       }

        $this->rawTestResults = array(); //need a temporary array to extract data from the DOM::NodeList object

        foreach($testData as $data){
            $this->rawTestResults[] = $data->nodeValue;  //extract DOM NodeList into an array for easy reading later
        }
		
        // parse the raw Test Results array into a new array suitable for Laravel's multi-record insert method
        $count = count($this->rawTestResults);
		$returnArray = array();
		$tempArray = array();
		$i=0;
		
		while($i < $count){
			
			foreach($this->innerArray as $key => $value){
				$this->innerArray[$key] = $this->rawTestResults[$i];
				$i++;
			}
			$returnArray[] = $this->innerArray;				// store a set of results in the return array
		}
		
		return $returnArray;
		
		
     }

    private function getHTMLtag($array){

        foreach($array as $key => $value){
            return $value; 
        }
    }
    
    private function convertToDATETIME($value){
    	$newTime = '';
    	//this part which grabs the date is probably not robust enough, esp since
    	$strings = explode(' ',$value);
    	$date = $strings[3]."-".$strings[2]."-".$strings[1];
    	$time = $strings[4];
    
    	$timechunks = str_split($time,2);
    	$count = count($timechunks);
    	$i = 1;
    
    	foreach($timechunks as $timechunk){   //convert to the HR:MIN:SEC format
    		$newTime = $newTime.$timechunk;
    		if($i < $count){
    			$newTime = $newTime.":";
    			$i++;
    		}
    	}
    	if($count < 3){
    		$newTime = $newTime.":00";
    	}
    	$converted = strtotime($date);
    	$date = date('Y-m-d', $converted);
    
    	return $date." ".$newTime;
    }
    

}
?>