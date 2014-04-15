<?php
/** 
 * 
 * A separate parsing script will load this config file.
 *
 * This config file tells a file parsing algorithm 3 pieces of information
 * 
 * 1) db table names which are the "key" in the array. It's "value" is a nested array
 * 2) within the nested array for each db table, the first element contains the parsing method
 * 		a) By keyword:  searches for data that is preceded by a specific keyword
 * 		b) By html tag: searches for data based on what html tags the data is inside of
 * 3) within the nested array for each db table, (ignoring the first array element) the key/value pairs are
 *      Key: is the db table column name where the data should go
 *      Value: is obviously, whatever value was found based on whatever parsing mode was chosen
 *      
 * 
 * 
 **/

$parser_config_array = array (		

"projects" 			=> array("mode"	 					=> "keyword", 
							"name"		 				=> "Test Report"),
							
"serial_numbers" 	=> array("mode"						=> "keyword", 
						 	"pcb"						=> "Serial Number"),

"test_attempts"		=> array("mode"						=> "keyword",
							"final_result"				=> "Final Result",
							"date"						=> "Tests Completed"),

"awt_test_metadata"	=> array("mode"						=> "keyword",
							"inspector_number"  		=> "Inspector Number",
							"tns_system"				=> "TNS System",
							"tns_software_version"		=> "TNS Software Version",
							"test_program_set_build"	=> "Test Program Set Build",
							"tps_version"				=> "TPS Version",
							"path_loss_file_due"		=> "Path Loss File Due"),

"test_results" 		=> array("mode"						=> "td",
							"test_num"					=> "Test No.",
							"test_name"					=> "Test Name",
							"min"						=> "Min",
							"max"						=> "Max",
							"actual" 					=> "Actual",
							"units"						=> "Units",
							"result"					=> "Result")


);