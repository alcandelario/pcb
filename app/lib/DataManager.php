<?php
/***********************************************
 * A simple class to hold data in arrays and 
 * retrieve upon request 
 ***********************************************/
 class DataManager{
             
     public function __construct($baseDir = '',$parseMode = 0){
             $this->parseMode = $parseMode;
               $this->baseDir = $baseDir;
         $this->fileContainer = array();
          $this->fetchCounter = 0;    
             $this->fileCount = 0;
                $this->wrkDir = $baseDir;  //can be changed
               $this->openDir = "";
                         $dir = "";
         $this->parsedFolders = array();
         
         // Save the baseFolder to a variable
                        $dirs = explode("\\",$this->baseDir);
            $this->baseFolder = $dirs[(count($dirs)-1)];
     }
     
     public function setWrkDirectory($wrkDir){
         /****Set the working directory and return a handle for it****/
         $this->wrkDir = $wrkDir;
          $dir = opendir($this->wrkDir);
          
          if(!$dir){
             return FALSE; //couldn't open directory
          }
          else{
              closedir($dir);
              return;
          }
     }
     
     public function getWrkDirectory(){
         return $this->wrkDir;
     }
     
     public function fetchNextRawData($ext){
        
         $complete = FALSE;
           $opened =  $this->directoryMan(FALSE);  
        /****Get a file with the supplied extension only if we can open the directory****/ 
          while(!$complete && $opened !== FALSE){
               
            $fileFound = FALSE;
                 $skip = FALSE;
                 $file = readdir($this->openDir);
              
              // does it have our required file extension   
              if(strpos($file,$ext) !== FALSE){
                   
                   //filter out already parsed files
                   if(stripos($file,"PARSED") !== FALSE){
                       $skip = TRUE;
                   }
                   else{
                   
                   // we haven't touched it yet. Let's mark it as parsed
                       $orig = $this->wrkDir."\\".$file;
                     $parsed = $this->wrkDir."\\"."PARSED_".$file;
                    $success = rename($orig,$parsed);
                  $fileFound = TRUE;
                       $file = "PARSED_".$file;
                   }
               }
               
               // may want to replace this with an array of illegal filetypes if that list grows
               elseif(stripos(".",$file) !== FALSE   || 
                      stripos("..",$file) !== FALSE  ||
                      strpos($file,".swp") !== FALSE ||
                      strpos($file,"~") !== FALSE){
                   $skip = TRUE;
               }
               elseif($file === 0 || $file === FALSE){

                  // we've read/parsed thru all the files in this directory 
                       $this->directoryMan(TRUE);
                     $curDir = $this->getWrkDirectory();
                       $dirs = explode("\\",$curDir);
                  $curFolder = $dirs[(count($dirs)-1)];
                  
                  // are we in the base directory? If so, we've searched all files and subfolders
                  if(stripos($this->baseFolder,$curFolder) !== FALSE){
                          $skip = TRUE;
                          $file = FALSE;
                  }
                  else{
                  
                  // lets change current working directory to one level up
                       $this->parsedFolders[] = $curFolder;
                       $newDir = str_replace("\\".$curFolder,'',$curDir);
                       $this->setWrkDirectory($newDir);
                       $this->directoryMan(FALSE);
                  }
               }
               else{
                   // if it passes thru all our other filters above, lets see if the file
                   // is an actual directory. If so, enter that directory and start searching
                   // for valid files
                   if(!in_array($file,$this->parsedFolders)){
                        $curDir  = $this->getWrkDirectory();
                        $dirTest = $curDir."\\".$file;
                        // is this an actual directory?
                        if(is_dir($dirTest)){
                            $this->setWrkDirectory($dirTest);
                            $this->directoryMan(FALSE);
                            $toBeParsed = $this->fetchNextRawData($ext);
                            if($toBeParsed !== FALSE){
                                $file = $toBeParsed;
                                $fileFound = TRUE;
                            }
                            else{
                                $skip = TRUE;
                                $file = FALSE;
                            }
                        }
                        else{
                        // Its not a directory or a file extension we want
                            $skip = TRUE;
                        }
                   }
                   else{
                   // it's a directory we've already parsed thru completely
                       $skip = TRUE;
                   }
               }
               
               if($skip === FALSE){
                    if($fileFound){
                        $complete = TRUE;
                    }
               }
               elseif($file === FALSE){
                   $complete = TRUE;
               }
          }
  //       @$this->directoryMan(TRUE);
         return $file;
     }
     
     public function directoryMan($closeFlag){
      /***************************************
      * uses the $this->openDir variable
      * as the controller for the working
      * directory. Send the directoryMan()
      * function False if it should keep 
      * the directory open or True to Close 
      * it.
      *****************************************/
        if($closeFlag){
            @closedir($this->openDir);
            return;
            //directory closed by request
        }
        
        // if not trying to close the directory, continue
        if(is_resource($this->openDir)){
            closedir($this->openDir);
            $this->openDir = opendir($this->wrkDir);
        }
        else{
            $this->openDir = opendir($this->wrkDir); 
        }        
        //report error if it didn't work
        if(!is_resource($this->openDir)){
             return FALSE;          //couldn't open the directory
        }
        else{
            return TRUE;
        }
     }
         
     public function countFiles($arrayOfValidFileTypes){
         // found the first part of this function online
         // http://php.net/manual/en/class.recursivedirectoryiterator.php

         $ritit = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($this->wrkDir), RecursiveIteratorIterator::CHILD_FIRST); 
             $r = array(); 
        foreach ($ritit as $splFileInfo) { 
           $path = $splFileInfo->isDir() 
                 ? array($splFileInfo->getFilename() => array()) 
                 : array($splFileInfo->getFilename()); 

           for ($depth = $ritit->getDepth() - 1; $depth >= 0; $depth--) { 
               $path = array($ritit->getSubIterator($depth)->current()->getFilename() => $path); 
           } 
           $r = array_merge_recursive($r, $path); 
        }
        
        // count up only the valid files
        foreach($r as $key => $filename){
            if (is_array($filename) && !empty($filename)){
                foreach($filename as $key => $file){
                    if(is_array($file) && !empty($file)){
                        $this->countFiles($arrayOfValidFileTypes);
                    }
                    elseif(empty($file)){
                    }
                    else{
                        $extension = explode(".",$file);
                        $extension = $extension[1];
                       if(in_array($extension,$arrayOfValidFileTypes)){
                           $this->fileCount++;
                       }
                    }
                }
            }
            elseif(empty($filename)){
            }
            else{
                $extension = explode(".",$filename);
                $extension = $extension[1];
                if(in_array($extension,$arrayOfValidFileTypes)){
                    $this->fileCount++;
                }
            }
        }
         return $this->fileCount;
     }
     
     public function numberOfFiles(){
         if($this->fileCount > 0){
            return $this->fileCount;
         }
         else{
             $this->fileCount = count($this->fileContainer);
             return $this->fileCount;
         }
     }

     public function storeParsedData($array){
         $this->fileContainer[] = $array;
     }
     
     public function updateMasterParsedData($array){
         $this->fileContainer = $array;
     }
     
     public function fetchNextParsed(){
         $count = count($this->fileContainer);
         if($this->fileCount === 0 && $count === 0){
             return FALSE; //no files have been parsed or entered into the dataManager
         }
         elseif($count > 0){
             $this->fileCount = $count;
         }
         
         if($this->fetchCounter < $this->fileCount){
             $array = $this->fileContainer[$this->fetchCounter];
             $this->fetchCounter++;
             return $array;
         }
         else{
             return FALSE; //no more files to parse
         }
     }
     
     public function getDataManMaster(){
         return $this->fileContainer; 
     }
     
     public function setFileCounter($count){
             $this->fileCount = $count;
     }
 }
?>
