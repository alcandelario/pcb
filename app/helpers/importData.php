<?php

$app_root = app_path();

require_once($app_root."/config/custom/app_config.php");
require_once($app_root."/config/custom/importedtestdata_config.php");


//make sure uploaded file is either .htm, .html or .zip
//if it is one of those, create a folder in a master working directory with the name of the uploaded file + random characters.
// move the file to the new directory 
// fire up the file data extractor class to extract the data


    $fileUploadDirectory = $app_root;
               $parseDir = PARSE_DIR;
       $rawDataExtension = RAW_DATA_EXT;
              $allowedFT = array("zip","html","htm"); //allowed filetypes for data results, either a single file or a zip containing multiples of an allowed filetype 
              $configEXT = "config";
                  $allFT = $allowedFT;
                $allFT[] = $configEXT;
    if(isset($_GET['parseMode'])){
        $parseMode = $_GET['parseMode'];
    }
    else{
        // assumes uploaded files by user that are only temporary and will be deleted
        $parseMode = 0;
    }
              
    if($parseMode == 1 || !uploadErrors()){
        if($parseMode == 0){
            $results = saveUploadedFileInfo($allFT);                                        //store the relevant files returned from the SUPERGLOBAL, $__FILES
            if(!is_array($results)){                                                        //were any of the files NOT in the whitelist?
            //    echo "Error: One of the files uploaded doesn't seem to be the correct filetype. Try again.(Line 16: importData.php)";
            }
            else{
                foreach($results as $filename => $value){                                       //get the actual config File Name
                    if(stripos($filename,$configEXT) !== FALSE){
                        $configFile = $filename;
                    }
                }
                //verify file validity/integrity/etc...
                $filesOK = uploadedFileValidation($results,$allowedFT,$fileUploadDirectory);
            }
        }
        if($parseMode ==1 || $filesOK){
            if($parseMode == 1){
                $baseDir = RAWDATA_BASEDIR;
                $configFile = PARSER_CONFIG_FULLPATH;
            }
            else{
                $wrkDir = $app_root.$parseDir;
               $baseDir = moveToWorkingDirectory($results,$wrkDir);     //get these files into their own directory
            $configFile = $baseDir."\\".$configFile;                    //get the actual .txt filename for the config file
            }
            $tempDB = new dbTemplate();
            $tempDB->loadConfigFile($configFile);                   //load instructions on what the setup looks like in terms of dB tables for this product. The
                                                                    //the formatting rules for the parser config file are in the constructor for class.dbTemplate.inc.php
             $files = new dataManager($baseDir,$parseMode);

           //$numFilesToParse = $files->countFiles($allowedFT);

             $complete = FALSE;
             $i = 0;
             while(!$complete){
                $toBeParsed = $files->fetchNextRawData($rawDataExtension);
                if($toBeParsed === FALSE){
                    $complete = TRUE;
                    $files->directoryMan(TRUE);
               }
                else{
                           $wrkDir = $files->getWrkDirectory();
                    $fileExtractor = new fileDataExtractor($wrkDir,$toBeParsed);
                            $array = $tempDB->getMaster();
                    $parsedResults = $fileExtractor->populateFileDataInTempDB($array); 
                    $files->storeParsedData($parsedResults);
                    //$fileExtractor->extractionComplete();
                }
           }
        }
        else{
            echo "Error uploading or validating the raw test data. Please try again.";
            exit;
        }
    }
    else{
        echo "Upload Error: Go back and try again(importData.php script)";
        exit;
    }
      
      $allDone = $files->getDataManMaster();
   $dbImporter = new dbImportManager();
   $dbImporter->importParsedPCBData($files);                        //send the dataManager Object
   
   // if user uploaded these files, delete the temporary directory
   if($parseMode == 0){
        unset($files);
        unset($fileExtractor);
        $success = chmod($wrkDir,0777);  
         $delete = new Utils();                                       //houskeeping to get rid of working directory
         $delete->deleteDir($baseDir);
   }
   $success = chdir($app_root);
   
   // add the user to the list of team members for this project since they uploaded the data
   $dbControl = new dbController();
   
    
   header('Location: /views/main_allproducts/index.php');           //permanent redirect to this page
   exit;
    
/************************PRIVATE SCRIPT FUNCTIONS*******************/
  function loadClassOnDemand(){
    /********************************************
    * AUTOLOADER FOR EXTERNALLY LOCATED CLASSES
    *********************************************/
        spl_autoload_register(
            function($className) {
            $root = $_SESSION['application_root'];
             $dir = $root."\\lib\\"; 
                include ($dir.'class.'.$className.'.inc.php');
            }
        );
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
  
  function saveUploadedFileInfo($allowedFT){ 
    /*********************************************************************
     * If all goes well, this function returns an array
     * that looks like: 
     * 
     * Array = ($filename1 => $pathtofile1,$filename2 =>$pathtofile2...);
     * 
     * Otherwise, this function returns the string "FALSE" 
     * and the offending filename
     * 
     * 5/16/13 - This algorithm will use  it's own stored parser.config file
     *           for raw html data OR it'll see if it's passed a custom one
     *           via upload
     * 
     * This entire script only works with filetypes in the array at the top 
     * of this script
     **********************************************************************/
              $app_root = $_SESSION['application_root'];
      $parserConfigFile = PARSER_CONFIG_FILENAME;                           //use default parser config if no other is specified
         $parserFileLoc = PARSER_CONFIG_FULLPATH;
          $uploadedFile;
       $uploadedFileLoc;
        
        $fileInfo = array();                                                    //return variable
       
        foreach($_FILES["files"]["name"] as $filename ){
            $type = pathinfo($filename, PATHINFO_EXTENSION);                    //get the extension
           $index = array_search($type,$allowedFT);                             //try to find it in the array of valid file extensions
            $ext  = $allowedFT[$index];                                         //try to copy the specific extension from the array
             $ext = strtolower($ext);                                           //don't want any capital letters
             
            if($index !== FALSE){                                               //was the file extension found?
                if($ext == '.config'){
                    $parserConfigFile = $_FILES["files"]["name"][$index];       //save the .txt as the parser config file
                       $parserFileLoc = $_FILES["files"]["tmp_name"][$index];
                }
                elseif(in_array($ext, $allowedFT)){                             //if not a .txt,hopefully it's another allowable file type
                    foreach($_FILES["files"]["name"] as $index => $filename){
                        if(strpos($filename,$ext) !== FALSE){                   //parse all the filenames till we find the right one
                               $uploadedFile = $_FILES["files"]["name"][$index];
                            $uploadedFileLoc = $_FILES["files"]["tmp_name"][$index];
                        }
                    }
                }
            }
            else{
                $fileInfo = "FALSE"."".$filename;
                return $fileInfo;                                               //exit as soon as we got a file we didn't expect even if only one is bad, reject the entire upload
            }
        }
        $fileInfo = array($parserConfigFile => $parserFileLoc,
                              $uploadedFile => $uploadedFileLoc);
        return $fileInfo;
    }
          
  function moveToWorkingDirectory($fileArray,$parseDir){
/********************************************************************
 * Ensure the "uploadedFileValidation" function has been run by now.
 * Make sure it is robust enough to handle your uploaded file types.
 *  
 * Here we unzip any .zip's to a working directory and copy over 
 * all other validated files.
 * 
 * Working directory is randomly generated so no two users can ever
 * manipulate the same directory
 * 
 * RETURN: The name of the radomly generated working directory
 * 
 *   !!!A "retry loop" MIGHT return FALSE for this function if  
 *      PHP has a hard time opening or creating the randomly 
 *      generated directory!!!
 ************************************************************************/
        $configFolder = $_SESSION['application_root']."\\config";
        
        $uniqueFolder = FALSE; //initialize the return variable
        $uniqueFolder = createUniqueFolder($parseDir); 
        
        if($uniqueFolder !== FALSE){  //did we create it?
            foreach($fileArray as $actualFilename => $tempFile){  //either unzip files or straight copy them

                    $type = pathinfo($actualFilename, PATHINFO_EXTENSION);

                if($type == "zip" || $type == "ZIP"){ //extract it into working directory
                 $newFile = $uniqueFolder."\\".$actualFilename; //we need a unique folder in case other users are doing the same thing
                   rename($tempFile, $newFile); //copy to working directory
                     $zip = new ZipArchive();
                    $file = $zip->open($newFile);
                    $file = $zip->extractTo($uniqueFolder);
                        
                        @unlink($tempFile);
                    $zip->close();
                        @unlink($newFile); //we don't need the zip file anymore
                }
                else{
                    $newFile = $uniqueFolder."\\".$actualFilename;
                      copy($tempFile, $newFile);
                      
                      if(stripos($tempFile,$configFolder) !== FALSE){           //don't delete the parserConfig file if it's ours
                      }
                      else{
                         @unlink($tempFile);
                      }
                }
            }
        }
        return $uniqueFolder;
   }
   
  function createUniqueFolder($path){
    /***************************************************
    * Try 10 times to generate a unique folder name
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
    
  function uploadedFileValidation($filesToCheck,$allowedFT,$uploadDir){
    /************************************************************
     * Array input format: ($filename => $pathToTempFile,...);
     * 
     * Add your validation checks here for whatever file type
     * you want. Currently, no tests for the parserConfig file
     * other than checking file extension.
     * 
     * Same goes for .htm/.html files
     * 
     * Zip files though are "test unzipped" to see if it is 
     * a real zip file. Returns false if not
     *************************************************************/
        $curDir = dirname(__FILE__);
        
        foreach($filesToCheck as $file =>$tempFilePath){  
            $type = pathinfo($file, PATHINFO_EXTENSION);
            //insert Checks IF ANY to validate parser config file HERE
            if($type === "zip" || $type === "ZIP"){
                $copyOrigin = $tempFilePath;
                $tempDir = $curDir."\\".$file;
                $success = mkdir($tempDir); 
                $copyDestination = $tempDir."\\".$file; //copy to a temporary folder that will be deleted  
                copy($copyOrigin, $copyDestination);
                $zip = new ZipArchive(); 
                $file = $zip->open($copyDestination);
                @$success = $zip->extractTo($tempDir); //see if it really is a zip file
                if(!$success){
                    return $file;
                }
                else{
                    $pass = TRUE;
                    $zip->close(); //must close the temporary archive before deleting it!
                    $delete = new Utils();
                    $delete->deleteDir($tempDir);  //we don't need it anymore
                }
            }
        }
          return TRUE;  //if we hit this, it means all files passed the file type checks
    }

?>
