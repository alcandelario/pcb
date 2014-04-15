<?php
class Utils{
    public function __construct() {
 		$a = 0;
    }
    
    public function deleteDir($dir){
        $class_func = array(__CLASS__, __FUNCTION__);
        $filesInDirectory = glob($dir.'/*');
        foreach($filesInDirectory as $file){
            
            if(is_dir($file)){
                $this->deleteDir($file);
            }
            else{
             unlink($file);
            }
        }
        @rmdir($dir);
    }
    
  	public function createUniqueFolder($path){
    
    	// Try 10 times to generate a unique folder name
    	$complete = FALSE;

   	 	$i = 0;
                                                                                //returns false if it can't do it for whatever reason
           while($i < 10){                                                      //lets not try this forever
                $unique = rand();
                $newPath = $path.$unique;                                  //convert to string

                if(file_exists($newPath) || is_dir($newPath)){
                   $i++;
                }
                else{
                   //make the new directory 
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
   	 }

   		public function isZipFile($folder,$file){
   		/**
   		 * Use the PHP ZipArchive class to confirm the file
   		 * is indeed a zip file.
   		 */
   			$zip = new ZipArchive();
   			$fh = $zip->open($folder."\\".$file);
   			$success = $zip->extractTo($folder); //see if it really is a zip file
   			if(!$success){
   				return FALSE;
   			}
   			else{
   				$zip->close();
   				return TRUE;
   			}
   		}





}
?>
