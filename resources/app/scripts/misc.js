/*
 * This file contains function that can be used by multiple scripts.
 *  For now, readFile function can be unusable in the future, so be careful with it.
 */

/**
 * Show the loading pop-up
 */
function showLoadingPopUp() {
	var popUp = document.getElementById(LOADING_POP_UP_ID);
	popUp.style.display = "flex";
}

/**
 * Hide the loading pop-up
 */
function hideLoadingPopUp() {
	var popUp = document.getElementById(LOADING_POP_UP_ID);
	popUp.style.display = "none";
}

/**
 * set the button "update" in higlighted mode or not, depending on the specified value
 * @param {boolean} highlight if button must be higlighted or not
 */
function setHighlightUpdateButton(highlight) {
	var button = document.getElementById(UPDATE_BUTTON_ID);
	var isHighlighted = button.classList.contains(HIGHLIGHT_CLASS_NAME);
	if (highlight) {
		/*if is already higlighted, nothing other to do */
		if (!isHighlighted) {
			button.classList.add(HIGHLIGHT_CLASS_NAME);
		}
	} else {
		if (isHighlighted) {
			button.classList.remove(HIGHLIGHT_CLASS_NAME);
		}
	}
}

/**
 * Remove focus of all inputs tags
 */
function loseFocus() {
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].blur();
	}
}

/**
 * Change a value specified so that is between two specified (and inclusive) bounds. 
 * @param {number} value the value to test
 * @param {number} minValue the min value that value can reach
 * @param {number} maxValue the max value that value can reach
 * @returns {number} the value clamped 
 */
function clamp(value, minValue, maxValue) {
	if (value < minValue) {
		value = minValue;
	} else if (value > maxValue) {
		value = maxValue;
	}
	return value;
}

/**
 * Swap the values of 2 values in specified array
 * @param {Array} array 
 * @param {Number} index1 
 * @param {Number} index2 
 */
function swapValuesInArray(array, index1, index2) {
	var tmp = array[index2];
	array[index2] = array[index1];
	array[index1] = tmp;
}

/**
 * Gets all data in file and returns it.
 * @param {String} fileName the name of the file
 * @returns {String} the content of the file, or nothing if file can't be readed
 * @deprecated
 */
function readFile(fileName) {
	var file = new XMLHttpRequest();
	file.onreadystatechange = function () {
		if (file.readyState == 4) {
			if (file.status === 200 || file.status == 0) {
				text = file.responseText;
			}
		}
	}
	file.open("GET", fileName, false);
	file.send(null);
	return file.responseText;
};


/**
 * Check if a variable is defined
 * @param {any} variable the varible to check
 * @returns {boolean} true if variable exists
 */
function varExists(variable) {
	return typeof variable !== "undefined";
}

/**
 * Get all data in the main table, except the first one with table headers.
 * @returns {DatabaseRow[]} an array containing Objects which holds desired data
 */
function getTableData() {
	var tbody = document.getElementById(TBODY_ID);
	var rows = tbody.rows;
	var i = 0;
	var resultArray = new Array(rows.length - 1);
	for (var j = 0; j < rows.length; j++) {
		resultArray[i] = getTrData(rows[j]);
		i++;
	}
	return resultArray;
}

/**
 * Get the tr where button is located. 
 * @param {HTMLButtonElement} button the button who launch the action
 * @returns {HTMLTableRowElement} the grand-parent table row
 */
function getButtonTr(button) {
	/*A button in table is in td, and this td is in the tr we want.*/
	return button.parentNode.parentNode;
}

/**
 * Get all data needed in a specified table row.
 * @param {HTMLTableRowElement} tableRow the table row where data will be extracted
 * @returns {DatabaseRow} the objext containing all data needed  
 */
function getTrData(tableRow) {
	/*get all the fields*/
	var ref = tableRow.getElementsByClassName(REFRENCE_CLASS_NAME)[0].innerHTML;
	var dsc = tableRow.getElementsByClassName(DESCRIPTION_CLASS_NAME)[0].innerHTML;
	var prx = tableRow.getElementsByClassName(PRICE_CLASS_NAME)[0].innerHTML;
	var qty = tableRow.getElementsByClassName(QUANTITY_CLASS_NAME)[0].innerHTML;
	return new DatabaseRow(ref, dsc, prx, qty);
}

/**
 * Modify the data in the specified table row with the provided data
 * @param {HTMLTableRowElement} tableRow the table row where change data
 * @param {DatabaseRow} rowData the object containing all data
 */
function setDataInRow(tableRow, rowData) {
	tableRow.getElementsByClassName(REFRENCE_CLASS_NAME)[0].innerHTML = rowData.reference;
	tableRow.getElementsByClassName(DESCRIPTION_CLASS_NAME)[0].innerHTML = rowData.description;
	tableRow.getElementsByClassName(PRICE_CLASS_NAME)[0].innerHTML = rowData.price;
	tableRow.getElementsByClassName(QUANTITY_CLASS_NAME)[0].innerHTML = rowData.quantity;
}

/**
 * Create the td containing the 3 buttons of a table row
 * @returns {HTMLTableDataElement} the td containing buttons
 */
function createButtonsTd() {
	/*Create the 4 buttons*/
	var buttonLess = document.createElement('button');
	/*buttonLess.setAttribute("onclick", "decrementQuantityTd(this.parentNode.parentNode)");*/
	buttonLess.setAttribute("onmousedown", "startInterval(this, decrementQuantityTd)");
	buttonLess.setAttribute("onmouseup", "stopInterval()");
	buttonLess.appendChild(document.createTextNode("-"));
	var buttonPlus = document.createElement('button');
	buttonPlus.setAttribute("onmousedown", "startInterval(this, incrementQuantityTd)");
	buttonPlus.setAttribute("onmouseup", "stopInterval()");
	buttonPlus.appendChild(document.createTextNode("+"));
	var buttonModify = document.createElement('button');
	buttonModify.setAttribute("onclick", "showModifyPopUp(this)");
	buttonModify.appendChild(document.createTextNode("Modifier"));
	var buttonRemove = document.createElement('button');
	buttonRemove.setAttribute("onclick", "remove(this)");
	buttonRemove.appendChild(document.createTextNode("Supprimer"));

	/*add them to a td*/
	var td = document.createElement('td');
	td.setAttribute("class", BUTTONS_CLASS_NAME);
	td.appendChild(buttonLess);
	td.appendChild(buttonPlus);
	td.appendChild(buttonModify);
	td.appendChild(buttonRemove);

	return td;
};

/**
 * Create a new table row that can be put in table
 * @param {String} ref the reference field
 * @param {String} desc the description field
 * @param {String} price the price field
 * @param {String} qty the quantity field
 */
function createNewTableRow(ref, desc, price, qty) {
	/*Create a node for each of attributes*/
	var tr = document.createElement('tr');
	var tdRef = document.createElement('td');
	tdRef.setAttribute("class", REFRENCE_CLASS_NAME);
	tdRef.appendChild(document.createTextNode(ref));
	var tdDesc = document.createElement('td');
	tdDesc.setAttribute("class", DESCRIPTION_CLASS_NAME);
	tdDesc.appendChild(document.createTextNode(desc));
	var tdPrice = document.createElement('td');
	tdPrice.setAttribute("class", PRICE_CLASS_NAME);
	tdPrice.appendChild(document.createTextNode(price));
	var tdQuantity = document.createElement('td');
	tdQuantity.setAttribute("class", QUANTITY_CLASS_NAME);
	tdQuantity.appendChild(document.createTextNode(qty));
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
 * replace an undefined string by an empty string
 * @param {string} string the string to test
 * @returns {string} the string specified or an empty string
 */
function replaceUndefined(string) {
	if (typeof(string) === "undefined"){
		return "";
	}
	return string;
}