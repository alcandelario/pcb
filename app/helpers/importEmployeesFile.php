<?php
    @session_start();
    $app_root = $_SESSION['application_root'];
    require_once($app_root."/config/app_config.php");
    require_once($app_root."/phpExcel/Classes/PHPExcel.php");
    loadClassOnDemand();
    define("MIN_ROW_ITEMS",6);  //excludes the "location" field in the excel doc
    define("MAX_COLUMNS",6);


    $fileUploadDirectory = FILE_UPLOAD_DIR;
               $parseDir = PARSE_DIR;
              $allowedFT = array("xls","xlsx","csv");

    // get the path to the uploaded file
    $tempfile = $_FILES['employeelist']['tmp_name'];
    $filename = $_FILES['employeelist']['name'];

    //move to working directory
     $wrkDir = $app_root.$parseDir;
    $baseDir = moveToWorkingDirectory($tempfile,$filename,$wrkDir);
    $wrkFile = $baseDir."\\".$filename;

    // get phpExcel to try and identify a filetype and return a phpExcel object
    $excelDoc = uploadedFileValidation($wrkFile);

    // if we have a valid filetype, move it to a working directory and continue
    if(is_object($excelDoc)){
        // Continue parsing the excel doc into a multirow SQL insert statement
        $namesArray = readWorksheetIntoINSERTstatement($excelDoc);
        $insertVals = implode(",",$namesArray);
        $query = "INSERT IGNORE INTO ".EMP_TBLNAME." (lastN,firstN,phoneW,phoneH,cellH,cellW) VALUES ";
        $query = $query.$insertVals.";";
        
        $dbControl = new dbController();
           $result = $dbControl->query($query);
           
        // delete the working directory and its contents
         $delete = new Utils();                                       //houskeeping to get rid of working directory
         $delete->deleteDir($baseDir);
      header("Location: /views/admin/index.php");
    }

function readWorksheetIntoINSERTstatement($excelDoc){
    /*
     * Parse out the excel document into a format for easy
     * insertion into the Employees database
     */
      $excelSheet = $excelDoc->getActiveSheet();
    $insertValues = array();
    
    foreach ($excelSheet->getRowIterator() as $row) {
        $rowIndex = $row->getRowIndex();
      // we grabbed a row above, now lets iterate thru 
      $cellIterator = $row->getCellIterator();
      // only look at cells that are populated with something
      $cellIterator->setIterateOnlyExistingCells(TRUE); // This loops all cells,
      
      $rowValue = '';
      $colIndex = 1;
      $person = FALSE;
      
      foreach ($cellIterator as $key => $cell) {
          // extract the actual value in that cell
          $val = $cell->getValue();
          
          // We've found our "header row" if we get in here 
          if(stripos($val,'Name') !== FALSE){
              $headerFound = TRUE;
              $index = $rowIndex;
          }
          // don't start saving anything till AFTER we've
          // found/surpassed our "header" row
          if(isset($headerFound) && ($rowIndex > $index)){
              // is this value separated with a comma? If so, it must 
              // be a persons name
              $values = explode(",",$val);
              if(count($values) > 1){
                  $rowValue[] = "'".addslashes($values[0])."'";  // last name
                  $rowValue[] = "'".addslashes($values[1])."'";  // first name
                  $colIndex++;
                  $person = TRUE;
              }
              elseif($key == 3){
                  // we know we have the Location of this person
                  $personLoc = "'".addslashes($val)."_".$rowIndex."'";
                  $colIndex++;
              }
              elseif($key == $colIndex && $key !== 3){
                $rowValue[] = "'".addslashes($val)."'";
                $colIndex++;
              }
              elseif($key > $colIndex && $key !== 3){
                  $padAmount = $key - $colIndex;
                  // pad with NULL
                  for($i=0; $i<$padAmount; $i++){
                      $rowValue[] = "NULL";
                      $colIndex++;
                  }
                  $rowValue[] = "'".addslashes($val)."'";
                  $colIndex++;
              }
          }
      }
      
      // add the row to the return array
      if(!empty($rowValue)){
        // pad the row with NULLs if necessary
        $count = count($rowValue);
        // this is for rows that contain a legit first name/last name
        if($count < MIN_ROW_ITEMS && $count > 2 && $person !== FALSE){
            for($i=$count;$i < MIN_ROW_ITEMS; $i++){
                $rowValue[] = "NULL";
            }
        }
        
        $newRow = implode(',', $rowValue);
        
        if($person === FALSE){
            // filter out any entries that don't look like a person but 
            // rather a location
            $complete = TRUE;
        }
        
        if(!isset($complete)){
          $insertValueArray[$personLoc] = "(".$newRow.")\r\n";
        }
        else{
            return $insertValueArray;
        }
      } 
    }
}

function uploadedFileValidation($inputFileName){
    /**************************************************************
     * Ask PHPExcel to try and determine if its a proper excel file
     *************************************************************/
    $curDir = dirname(__FILE__);

    /**  Identify the type of $inputFileName  **/
    $inputFileType = PHPExcel_IOFactory::identify($inputFileName);

    /**  Create a new Reader of the type that has been identified  **/
    $objReader = PHPExcel_IOFactory::createReader($inputFileType);
    $objReader->setReadDataOnly(true);

    /**  Load $inputFileName to a PHPExcel Object  **/
    $objPHPExcel = $objReader->load($inputFileName);

    if(is_object($objPHPExcel)){
        return $objPHPExcel;
    }
    else{
        return FALSE;
    }
}

function moveToWorkingDirectory($tempFile,$filename,$parseDir){
/*************************************************************************
 * Move the temp Excel file to a working directory for further inspections
 *************************************************************************/

    $uniqueFolder = FALSE; //initialize the return variable
    $uniqueFolder = createUniqueFolder($parseDir);

    if($uniqueFolder !== FALSE){  //did we create it?
        $newFile = $uniqueFolder."\\".$filename; //we need a unique folder in case other users are doing the same thing
          rename($tempFile, $newFile); //copy to working directory

         // delete original uploaded file
         @unlink($tempFile);
    }
    else {
        $uniqueFolder = FALSE;
    }
    return $uniqueFolder;
}

function createUniqueFolder($path){
    /***************************************************
    * Generates a random folder name that
    * should not already exist in the working directory
    ****************************************************/
       $complete = FALSE;
       $i = 0;
                                                                                //returns false if it can't do it for whatever reason
           while($i < 10){                                                      //lets not try this forever
                 $unique = rand();
                $newPath = $path."\\".$unique;                                  //convert to string
                if(file_exists($newPath) || is_dir($newPath)){
                   $i++;
                }
                else{
                    $complete = TRUE;
                           $i = 50;                                             //break out of loop, we did it!
                }
           }
           if(!$complete){
                return FALSE; //
           }
           else{
               $made = mkdir($newPath);
               chmod($newPath,0777);
               if(!$made){
                   return FALSE; //PHP failed to make the directory
               }
               else{
                   return $newPath;
               }
           }
   }

function uploadErrors(){
        /*************************************
        * Check all of the files contained in
        * the SUPERGLOBAL, $__FILES
        **************************************/
          foreach($_FILES["files"]["error"] as $error) {
                if($error > 0){
                    return TRUE;
                }
          }
          return FALSE;   //all the files uploaded without error
    }

function loadClassOnDemand(){
      /********************************************
      * AUTOLOADER FOR EXTERNALLY LOCATED CLASSES
      *********************************************/
          spl_autoload_register(
              function($className) {
                   $curDir = getcwd();
                     $root = $_SERVER['DOCUMENT_ROOT'];
                  $success = chdir($root."/lib");
                  include ('class.'.$className.'.inc.php');
                  chdir($curDir);
              }
          );
      }
?>