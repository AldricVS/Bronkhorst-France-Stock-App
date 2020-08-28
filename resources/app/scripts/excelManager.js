/**
 * This file contains all functions in order to manage excel files
 */
var XLSX = require('./scripts/xlsx.full.min.js');

/**
 * Create an excel file object with table content  
 */
function createExcelFileFromTable() {
	const sheetName = "Inventaire";
	/*create the workbook and add metadata*/
	var wb = XLSX.utils.book_new();
	wb.Props = {
		Subject: "Inventaire de Bronkhorst France",
		Author: "Aldric Vitali Silvestre",
		CreatedDate: new Date()
	}

	/*create a new sheet*/
	wb.SheetNames.push(sheetName);
	var table = document.getElementById(TABLE_ID);
	var rowsData = getTableData();
	/*add header rowData before others*/
	rowsData.unshift(new DatabaseRow("Référence", "Description", "Prix (€)", "Quantité"));
	var arr = [];
	for (var i = 0; i < rowsData.length; i++) {
		var row = rowsData[i];
		arr.push([row.reference, row.description, row.price, row.quantity]);
	}
	/*var ws = XLSX.utils.table_to_sheet(table);*/
	ws = XLSX.utils.aoa_to_sheet(arr);
	wb.Sheets[sheetName] = ws;
	return wb;
}

function objToXLSX(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var index = 0; index < s.length; index++) {
		view[index] = s.charCodeAt(index) & 0xFF;
	}
	return buf;
}

function exportXLSXFile() {
	var wb = createExcelFileFromTable();

	/*create the xlsx file */
	var wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    /*create an invisble link with xlsx file and click on it,
     simulating a download link*/
	var xlsxFile, downloadLink;
	xlsxFile = new Blob([objToXLSX(wbOut)], { type: "text/csv" });
	downloadLink = document.createElement("a");
	downloadLink.download = "Inventaire.xlsx";
	downloadLink.href = window.URL.createObjectURL(xlsxFile);
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	downloadLink.remove();
}

/**
 * import the xlsx file located in "data/tmpXlsx"
 * @param {string} quantityCellName the name of the quantity cell (the only one that can change over the time)
 */
function importXLSXFile(quantityCellName) {
	console.log("start importing");
	try {
		var data = fs.readFileSync("./resources/data/tmpXlsx/test.xlsx")
		/*In order to avoid undefined charCodeAt exception, we have to pre-process the data for SheetJs*/
		var binary = "";
		var bytes = new Uint8Array(data);
		for (var i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}

		/*Open the workbook at the right page*/
		var wb = XLSX.read(binary, {
			type: 'binary',
		});
		var sheet = XLSX.utils.sheet_to_row_object_array(wb.Sheets["Spare parts + stripped"]);

		//create array of rows with data needed
		var rowsData = [];
		var row, art, dsc, prc, qty;
		for (var i = 0; i < sheet.length; i++) {
			row = sheet[i];
			art = replaceUndefined(row[XLSX_ARTICLE_FIELD]);
			dsc = replaceUndefined(row[XLSX_DESCRIPTION_FIELD]);
			/*excel floating is a little different, so we have to redone it :
				we round the number 2 digits after the coma
			*/
			var prcVal = Number(parseFloat(row[XLSX_PRICE_FIELD])).toFixed(2);
			prc = replaceUndefined(prcVal.toString());
			qty = replaceUndefined(row[quantityCellName]);
			rowsData.push(new DatabaseRow(art, dsc, prc, qty));
		}

		//create the new json database 
		var jsonData = JSON.stringify(rowsData);
		fs.writeFileSync("./resources/data/database.json", jsonData, function (error) {
			if (error) {
				console.error("Error while creating json database from xlsx file : " + error);
			} else {
				console.log("json database created from xlsx file with success");
			}
		})


	} catch (e) {
		console.error(e);
	}
}

/**
 * Create a new xlsx file with new table quantities in specified column
 * @param {File} file the file where insert 
 * @param {string} fieldName the name of the first box of the column where fill 
 */
function insertQuantitiesInFile2(file, fieldName) {
	/*get the data from the file*/
	let reader = new FileReader();
	reader.onload = function () {
		var data = reader.result;
		/*In order to avoid undefined charCodeAt exception, we have to pre-process the data for SheetJs*/
		var binary = "";
		var bytes = new Uint8Array(data);
		for (var i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}

		/*Open the workbook at the right page*/
		var wb = XLSX.read(data, {
			type: 'binary',
			cellStyles: true
		});
		var sheet = XLSX.utils.sheet_to_row_object_array(wb.Sheets["Spare parts + stripped"]);
		/*For all rows in table, we will find the right place where to put the quantity
			if this place don't exist, create a new row*/
		var rowsData = getTableData();
		var row, index, sheetSize;
		/*for (var i = 0; i < rowsData.length; i++) {
			row = rowsData[i];
			index = sheet.findIndex(element => element[XLSX_DESCRIPTION_FIELD].v == row.description);
			//if index is not -1, we can put it in the right place/
			if (index != -1) {
				sheet[index][fieldName].v = row.quantity;
			}
			//we have to create a new row with matching data/
			else {
				console.log(row.description);
				sheetSize = sheet.length;
				sheet[sheetSize] = [];
				sheet[sheetSize][XLSX_ARTICLE_FIELD] = row.reference;
				sheet[sheetSize][XLSX_DESCRIPTION_FIELD] = row.description;
				sheet[sheetSize][XLSX_PRICE_FIELD] = row.price;
				sheet[sheetSize][fieldName] = row.quantity;
			}
		}*/
		console.log(wb);
		/*workbook is now completed, we have to save it and create a download link*/
		var xlsxFile, downloadLink;
		xlsxFile = new Blob([wb], { type: "text/csv" });
		downloadLink = document.createElement("a");
		downloadLink.download = file.name;
		downloadLink.href = window.URL.createObjectURL(xlsxFile);
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		downloadLink.remove();
	}

	reader.onerror = function () {
		throw reader.error;
	}

	reader.readAsBinaryString(file);
}

/**
 * Create a new xlsx file with new table quantities in specified column
 * @param {string} filePath the path of the file where insert data 
 * @param {string} fieldName the name of the first box of the column where fill 
 */
async function insertQuantitiesInFile(filePath, fieldName) {
	const xlsx_pop = require('./xlsx-populate/XlsxPopulate');
	const { shell } = require('electron');

	return xlsx_pop.fromFileAsync(filePath).then(workbook => {
		var sheet = workbook.sheet(XLSX_MAIN_SHEET_NAME);

		/*Get desired cells. New functions were implemented in the xlsx-populated framework in order to don't use regex uselessly*/
		const articleHeaderCell = sheet.findPerfect(XLSX_ARTICLE_FIELD)[0];
		const descriptionHeaderCell = sheet.findPerfect(XLSX_DESCRIPTION_FIELD)[0];
		const columnToFillHeaderCell = sheet.findPerfect(fieldName)[0];
		/*we check if any of the needed cells are here, else we have to end here*/
		if (typeof columnToFillHeaderCell === "undefined") {
			throw "Le champ fourni ne correspond a aucun intitulé de colonne.";
		}
		if (typeof articleHeaderCell === "undefined") {
			throw "Il n'existe pas de colonne ayant pour en-tête l'ititulé \"Article\" dans le fichier fourni";
		}
		if (typeof descriptionHeaderCell === "undefined") {
			throw "Il n'existe pas de colonne ayant pour en-tête l'ititulé \"Description\" dans le fichier fourni";
		}

		const articleColumnNumber = articleHeaderCell._columnNumber;
		const descriptionColumnNumber = descriptionHeaderCell._columnNumber;
		const columnToFillColumnNumber = columnToFillHeaderCell._columnNumber;
		/*The most important part : add the right values to the right place : 
		  we assume that each article have an unique description
		*/
		const rowsData = getTableData();
		var rowsLength = rowsData.length;
		var tableDataRow, sheetCell, rowCells;
		for (var i = 0; i < rowsLength; i++) {
			tableDataRow = rowsData[i];
			/*grab the row where article description matches*/
			sheetCell = sheet.findPerfect(tableDataRow.description)[0];
			if (sheetCell === undefined || sheetCell._columnNumber != descriptionColumnNumber) {
				continue;
			}

			/*if this cell exists and is at the right column, we will go to the location of the column to fill with*/
			rowCells = sheetCell._row._cells;
			if (tableDataRow.quantity === "") {
				rowCells[columnToFillColumnNumber].value(0);
			} else {
				rowCells[columnToFillColumnNumber].value(parseInt(tableDataRow.quantity));
			}

		}

		workbook.toFileAsync(require('path').dirname(filePath) + "\\mergedFile.xlsx");
	});
}


