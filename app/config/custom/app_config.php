<?php
/**
 *  parser configuration file
 */
define("PARSER_CONFIG", app_path()."\\config\\custom\\parser_config.php");

define("RAW_DATA_EXT",'.htm');

define("KEYWORD_PARSE","keyword");

define("HTML_PARSE","html");

// set the timezone
define("DEFAULT_TIMEZONE","America/Chicago");

// is this an open registration system or will users be added manually by an admin
define("OPEN_REGISTRATION",TRUE);

// default directory where raw test data is kept. A script will crawl all files
// in this folder (and its subfolders) looking for new data to import
define("RAWDATA_BASEDIR","C:\\xampp\htdocs\\AAA_WEB_DEV\\productdatatracking\\RawTestData");

// should we insert test data into the dB that was an incomplete or error
define("ALLOW_INCOMPLETE_TEST_DATA",FALSE);

// do we want to insert HTML meta tags showing which PHP method output which HTML? **/
define("HTML_DBG_OUTPUT", TRUE);

// location of default print label template
define("DEFAULT_LABEL_TEMPLATE", '\views\printlabels\labelTemplates\defaultLabel.tpl.php');


// File uploading info
define("FILE_UPLOAD_DIR",'C:\\xampp\\tmp');
define("PARSE_DIR",'\tmp\tmp_extracted_files');


?>
