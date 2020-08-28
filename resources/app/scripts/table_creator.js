/*
 * This file contains all functions needed for creating the table on the database page.
 * It requires jquery and jquery-css in order to work
 */

function restoreEmptyTBody() {
    document.getElementById("table_body").innerHTML = "";
}

/**
 * Create a table row for the database table
 * @param {Object} csvLine the csv Object containing attributes values
 * @return a table row 
 */
function createDatabaseTableRow(csvLine) {
    /*Create a node for each of attributes*/
    var tr = document.createElement('tr');
    var tdRef = document.createElement('td');
    tdRef.setAttribute("class", REFRENCE_CLASS_NAME);
    tdRef.appendChild(document.createTextNode(csvLine.reference));
    var tdDesc = document.createElement('td');
    tdDesc.setAttribute("class", DESCRIPTION_CLASS_NAME);
    /*we have commas represented by &comma; in csv, in order to don't have 
        misunderstandings when jquery-csv read the file. We have to replace them*/
    tdDesc.appendChild(document.createTextNode(csvLine.description.replace("&comma;", ",")));
    var tdPrice = document.createElement('td');
    tdPrice.setAttribute("class", PRICE_CLASS_NAME);
    tdPrice.appendChild(document.createTextNode(csvLine.prix.replace("&comma;", ",")));
    var tdQuantity = document.createElement('td');
    tdQuantity.setAttribute("class", QUANTITY_CLASS_NAME);
    tdQuantity.appendChild(document.createTextNode(csvLine.quantite));
    /* don't forget to add buttons + - and delete in a last td*/
    var tdButtons = createButtonsTd();

    tr.appendChild(tdRef);
    tr.appendChild(tdDesc);
    tr.appendChild(tdPrice);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdButtons);
    return tr;
};

/**
 * Fill a defined table with data contained in csv file.
 * The table must exits and have already a tbody tag to write in
 * @param {String} tbodyId the id of the tbody to write in
 * @param {String} csvFileName the name of the csv file to use
 */
function fillTableFromCsvFile(tbodyId, csvFileName) {
    var csvData = readFile(csvFileName);
    var csvArr = $.csv.toObjects(csvData);
    /*Get the tbody from document*/
    var tbody = document.getElementById(tbodyId);
    for (var i = 0; i < csvArr.length; i++) {
        var tr = createDatabaseTableRow(csvArr[i]);
        tbody.appendChild(tr);
    };
};

/**
 * Create a new table row with specified data.
 * @param {DatabaseRow} databaseRow the database row which contains needed data 
 */
function createTableRowWithDatabaseRow(databaseRow){
    /*Create a node for each of attributes*/
    var tr = document.createElement('tr');
    var tdRef = document.createElement('td');
    tdRef.setAttribute("class", REFRENCE_CLASS_NAME);
    tdRef.appendChild(document.createTextNode(databaseRow.reference));
    var tdDesc = document.createElement('td');
    tdDesc.setAttribute("class", DESCRIPTION_CLASS_NAME);
    tdDesc.appendChild(document.createTextNode(databaseRow.description));
    var tdPrice = document.createElement('td');
    tdPrice.setAttribute("class", PRICE_CLASS_NAME);
    tdPrice.appendChild(document.createTextNode(databaseRow.price));
    var tdQuantity = document.createElement('td');
    tdQuantity.setAttribute("class", QUANTITY_CLASS_NAME);
    tdQuantity.appendChild(document.createTextNode(databaseRow.quantity));
    /* don't forget to add buttons + - and delete in a last td*/
    var tdButtons = createButtonsTd();
    tr.appendChild(tdRef);
    tr.appendChild(tdDesc);
    tr.appendChild(tdPrice);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdButtons);
    return tr;
}

/**
 * Fill the table body with specified data
 * @param {DatabaseRow[]} databaseRowArray the array containing all rows data 
 */
function fillTableFromDatabaseRowArray(databaseRowArray){
    var tbody = document.getElementById("table_body");
    for(var i = 0; i < databaseRowArray.length; i++){
        var tr = createTableRowWithDatabaseRow(databaseRowArray[i]);
        tbody.appendChild(tr);
    }
}

/**
 * Fill the table with the json file.
 */
function fillTableFromJsonFile(){
	try{
		var jsonData = fs.readFileSync(DATA_FILE_NAME);
		var json = JSON.parse(jsonData);
		fillTableFromDatabaseRowArray(json);
		/*if no error occured during fill data, save the data file in backup folder*/
		fs.writeFileSync(DATA_FILE_BACKUP_NAME, jsonData);
	}catch(e){
		console.error(e);
		dialog.showMessageBoxSync({
			type: "error",
			title: "Erreur",
			buttons: ["Ok"],
			message: "Un problème est survenu lors de la création du tableau du stock.\nRaison : " + error
		});
	}
	
	
}