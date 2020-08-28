/*
 * This file is loaded on page loading end, and permits to fill the main table 
 */

window.$ = window.jQuery = require('./scripts/jquery-3.5.1.min.js');
const csv = require("./scripts/jquery-css.min.js");
const fs = window.require('fs');

/*if wanted, we will import xlsx file to create json database file
    in order to use this, add the desired file to "data/tmpXlsx" and uncomment line under
*/
//importXLSXFile("Quantité 31-12-19");

fillTableFromJsonFile();
hideLoadingPopUp();