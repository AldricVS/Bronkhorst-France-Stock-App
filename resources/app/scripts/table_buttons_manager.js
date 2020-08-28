/*
 * This file is used to implement functions used by buttons 'onclick' attribute.
 * jquery is required in order to work
 */

/*this variable is used to set repeat intervals when using buttons to increment or decrement*/
var intervalId;
/*The time in milliseconds for repeating */
const TIMER_REPEAT = 150;
/*we want to keep up the number of interval loop, in order to speed up repeat time
  if this value is among a certain value.
*/
var repeatCount = 0;
const REPEAT_THRESHOLD = 10;
const BIG_REPEAT_THRESHOLD = 20;

const { dialog } = require('electron').remote;

/**
 * Initalizes a repeter for a specified function
 * @param {HTMLElement} element the element used in function
 * @param {Function} functionToRepeat the function to repeat
 */
function startInterval(element, functionToRepeat) {
	/*execute the function once before start interval*/
	functionToRepeat(element);
	/*check if another intervalId is running before creating another*/
	intervalId = setInterval(functionToRepeat, TIMER_REPEAT, element);
}

function handleInterval(element, functionToRepeat) {
	/*check if interval repeat counter is big, and start a faster interval if it's the case*/
}

/**
 * Stop the interval previously initialised, and reset the repeat count
 */
function stopInterval() {
	clearInterval(intervalId);
	repeatCount = 0;
}

/**
 * Add a specified value of the td containing quantity.
 * The value is multiplied by 5 if the timer count is big enough (see on top of file) 
 * @param element the tr containing the td which will be changed
 * @param value the value to add to quantity td
 */
function addValueToQuantityTd(element, value) {
	/*The tr is 2 the parent of the parent of the button, we will retrieve it*/
	var tr = getButtonTr(element);
	/* get the td containing quantity with class name*/
	var quantityTd = tr.getElementsByClassName(QUANTITY_CLASS_NAME).item(0);
	/*Get the value in the quantity table row and add 1*/
	var innerValue = parseInt(quantityTd.innerHTML);

	/*special case if repeat counter is big enough*/
	if (varExists(repeatCount)) {
		if (repeatCount > BIG_REPEAT_THRESHOLD) {
			value *= 50;
		}
		else if (repeatCount > REPEAT_THRESHOLD) {
			value *= 5;
		}
	}

	innerValue += value;
	if (innerValue < 0) {
		innerValue = 0;
	}
	/*and put it back in the td*/
	quantityTd.innerHTML = innerValue;

	/*increase the repeat counter*/
	if (varExists(repeatCount)) {
		repeatCount++;
	}
}

/**
 * increase by 1 value of the td containing quantity.
 * @param {HTMLTableElement} element the table row containing the td to increase value
 */
function incrementQuantityTd(element) {
	addValueToQuantityTd(element, 1);
	setHighlightUpdateButton(true);
}

/**
 * decrease by 1 value of the td containing quantity.
 * @param {HTMLTableElement} element the table row containing the td to increase value
 */
function decrementQuantityTd(element) {
	addValueToQuantityTd(element, -1);
	setHighlightUpdateButton(true);
}

/**
 * Clear all input fields contained in the search field
 * @param {HTMLElement} element the element which contains inputs
 */
function clearAddFields() {
	var form = document.getElementById(ADD_FORM_ID);
	var inputs = form.getElementsByTagName('input');
	/*dont clear buttons field*/
	for (var i = 0; i < 4; i++) {
		inputs[i].value = "";
	}
}

/**
 * Show the add pop up form
 */
function showAddRowPopUp() {
	var div = document.getElementById(ADD_ROW_POP_UP_ID);
	div.style.display = "flex";
}

/**
 * Hide the add pop up form and reset all input fields
 */
function closeAddPopUp() {
	/*Remove all text in fields*/
	document.getElementById(ADD_REF_ID).value = "";
	document.getElementById(ADD_DSC_ID).value = "";
	document.getElementById(ADD_PRX_ID).value = "";
	document.getElementById(ADD_QTY_ID).value = "";
	var div = document.getElementById(ADD_ROW_POP_UP_ID);
	div.style.display = "none";
}

/**
 * Add a new row with data contained in input fields on top of the table
 */
function confirmAddPopUp() {
	addNewRow();
	var div = document.getElementById(ADD_ROW_POP_UP_ID);
	div.style.display = "none";
}


function showInsertPopUp() {
	var div = document.getElementById(INSERT_POP_UP_ID);
	div.style.display = "flex";
}

function closeInsertPopUp() {
	var div = document.getElementById(INSERT_POP_UP_ID);
	document.getElementById(INSERT_FILE_ID).value = "";
	document.getElementById(INSERT_NAME_ID).value = "";
	div.style.display = "none";
}

function confirmInsertPopUp() {
	const { shell } = require('electron');
	var filePath = document.getElementById(INSERT_FILE_ID).files[0].path;
	var fieldName = document.getElementById(INSERT_NAME_ID).value;
	const promise = insertQuantitiesInFile(filePath, fieldName);
	promise.catch((err) => {
		dialog.showMessageBoxSync({
			type: "error",
			title: "Erreur",
			message: "Erreur lors de l'insertion des quantités dans le fichier.\nRaison : " + err
		});
		console.error(err);
	});
	promise.then((value) => {
		shell.showItemInFolder(filePath);
	})
	closeInsertPopUp();
}

/**
 * add a new row in the database table, taking values from fields in text inputs
 */
function addNewRow() {
	/*To begin with, ask to user if he really wants to add this new row*/
	/*It can be better to check if user really wants to remove this row*/
	var answer = dialog.showMessageBoxSync({
		type: "question",
		title: "Ajouter ?",
		buttons: ["Oui", "Non"],
		message: "Voulez-vous vraiment ajouter cette ligne ?"
	});
	if (answer == 0) {
		try {
			/*get all values contained in form and add them at the bottom of the table*/
			var ref = document.getElementById(ADD_REF_ID).value;
			var dsc = document.getElementById(ADD_DSC_ID).value;
			var prx = document.getElementById(ADD_PRX_ID).value;
			var qty = document.getElementById(ADD_QTY_ID).value;
			var newTr = createNewTableRow(ref, dsc, prx, qty);
			/*add the row before others*/
			var firstTr = document.getElementById("table_body").getElementsByTagName("tr")[0];
			document.getElementById("table_body").insertBefore(newTr, firstTr);
			/*Remove all text in fields*/
			document.getElementById(ADD_REF_ID).value = "";
			document.getElementById(ADD_DSC_ID).value = "";
			document.getElementById(ADD_PRX_ID).value = "";
			document.getElementById(ADD_QTY_ID).value = "";

		} catch (e) {
			console.error(e);
			dialog.showMessageBoxSync({
				type: "error",
				title: "Erreur",
				buttons: ["Ok"],
				message: "La ligne n'a pas pu être ajoutée\nRaison : " + e
			});
		}
	}
	setHighlightUpdateButton(true);
}

/**
 * Remove the table row where button is located
 * @param {HTMLElement} button the button who launch the action
 */
function remove(button) {
	/*It can be better to check if user really wants to remove this row*/
	var answer = dialog.showMessageBoxSync({
		type: "question",
		title: "Enlever ?",
		buttons: ["Oui", "Non"],
		message: "Voulez-vous vraiment enlever cette ligne ?"
	});
	if (answer == 0) {
		var tr = getButtonTr(button);
		tr.remove();
	}
	setHighlightUpdateButton(true);
}

/*This variable is used in order to keep trace of the table row which is being modified*/
var currentPopUpTableRow;
/**
 * Opens the modify pop-up and puts values in it
 * @param {HTMLElement} button the button who launch the action
 */
function showModifyPopUp(button) {
	/*Get data from button's tr*/
	var tr = getButtonTr(button);
	/*save the reference to the table row for later*/
	currentPopUpTableRow = tr;

	var rowData = getTrData(tr);
	/*grab pop-op and put values*/
	var popUp = document.getElementById(MOD_POP_UP_ID);
	document.getElementById(MOD_REF_ID).value = rowData.reference;
	document.getElementById(MOD_DSC_ID).value = rowData.description;
	document.getElementById(MOD_PRX_ID).value = rowData.price;
	document.getElementById(MOD_QTY_ID).value = rowData.quantity;
	popUp.style.display = "flex";
}

function closeModPopUp() {
	/*reset the currentPopUpTableRow variable*/
	currentPopUpTableRow = undefined;
	/*hide the pop-up*/
	document.getElementById("pop_up_modify_row").style.display = "none";
}

function confirmModPopUp() {
	/*Check if currentPopUpTableRow is defined, if not, the function is ended*/
	if (varExists(currentPopUpTableRow)) {
		/*It can be better to check if user really wants to remove this row*/
		var answer = dialog.showMessageBoxSync({
			type: "question",
			title: "Modifier ?",
			buttons: ["Oui", "Non"],
			message: "Voulez-vous vraiment modifier cette ligne ?",
			nolink: true
		});
		if (answer == 0) {
			try {
				/*get all data in form*/
				var ref = document.getElementById(MOD_REF_ID).value;
				var dsc = document.getElementById(MOD_DSC_ID).value;
				var prx = document.getElementById(MOD_PRX_ID).value;
				var qty = document.getElementById(MOD_QTY_ID).value;
				/*put it in row*/
				setDataInRow(currentPopUpTableRow, new DatabaseRow(ref, dsc, prx, qty));
			} catch (e) {
				console.error(e);
			}
		}
	} else {
		console.error("currentPopUpTableRow is not defined, modification cancelled.");
	}
	/*We wanted also to close the pop up and reset the currentPopUpTable*/
	closeModPopUp();
	setHighlightUpdateButton(true);
}

function exportTableToCsv(tbody) {
	var rowsData = getTableData(tbody);
	/*sort rowsData by reference*/
	rowsData.sort(function (a, b) {
		if (a.reference.toLowerCase() <= b.reference.toLowerCase()) {
			return -1;
		} else {
			return 1;
		}
	});
	var csv = [];
	/*set first line directely*/
	csv.push("reference,description,prix,quantite");
	for (var index = 0; index < rowsData.length; index++) {
		var row = rowsData[index];
		/*replace "," in description and price in order to don't have confusions*/

		csv.push(row.reference + "," + row.description.replace(",", "&comma;") + "," + row.price.replace(",", "&comma;") + "," + row.quantity);
	}
	return csv;
}

function downloadCSVFile(csvData, fileName) {
	var csvFile, downloadLink;

	csvFile = new Blob([csvData], { type: "text/csv" });
	downloadLink = document.createElement("a");
	downloadLink.download = fileName;
	downloadLink.href = window.URL.createObjectURL(csvFile);
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();
}

function downloadFile() {
	exportXLSXFile();
}

/**
 * Update the json data file with new table content
 */
function updateFileFromTable() {
	var rowsData = getTableData();
	var jsonData = JSON.stringify(rowsData);
	fs.writeFile("./resources/data/database.json", jsonData, function (error) {
		if (error) {
			dialog.showMessageBoxSync({
				type: "error",
				title: "Erreur",
				buttons: ["Ok"],
				message: "Un problème est survenu lors de la mise à jour du stock.\nRaison : " + error
			});
		}
		dialog.showMessageBoxSync({
			type: "info",
			title: "Mise à jour",
			buttons: ["Ok"],
			message: "Le stock a été mis à jour avec succès."
		});
	})
	setHighlightUpdateButton(false);
}