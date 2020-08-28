/*
 * This File contains all functions needed to sort table
 */

/*
 * This number tells us if we have to sort by ascending order or no.
 * 1 = sort by ascending order & -1 = sort by reverse order
 * It will be changed after a call of sortTable()
*/
var sortRefenceOrderNumber = 1;
var sortDescriptionOrderNumber = 1;
var sortPriceOrderNumber = 1;
var sortQuantityOrderNumber = 1;

function setOrdersNumbers(refNum, dscNum, prxNum, qtyNum) {
    sortRefenceOrderNumber = refNum;
    sortDescriptionOrderNumber = dscNum;
    sortPriceOrderNumber = prxNum;
    sortQuantityOrderNumber = qtyNum;
}

function sortRowsData(rowsData, tableHeaderId) {
    /*sort rowsData depending on className*/
    switch (tableHeaderId) {
        case "reference_header":
            rowsData.sort(function (a, b) {
				/*some references are missing, we then don't want to have empty references on top of the table*/
				if(sortRefenceOrderNumber == 1 && a.reference == "")
					return 1;
                if (a.reference.toLowerCase() <= b.reference.toLowerCase()) {
                    return -1 * sortRefenceOrderNumber;
                } else {
                    return 1 * sortRefenceOrderNumber;
                }
            });
            /*reverse the order of sort and reset order of other fields*/
            setOrdersNumbers(sortRefenceOrderNumber * -1, 1, 1, 1);
            break;
        case "description_header":
            rowsData.sort(function (a, b) {
                if (a.description.toLowerCase() <= b.description.toLowerCase()) {
                    return -1 * sortDescriptionOrderNumber;
                } else {
                    return 1 * sortDescriptionOrderNumber;
                }
            });
            /*reverse the order of sort and reset order of other fields*/
            setOrdersNumbers(1, sortDescriptionOrderNumber * -1, 1, 1);
            break;
        case "price_header":
            rowsData.sort(function (a, b) {
                if (parseFloat(a.price.replace(",", ".")) <= parseFloat(b.price.replace(",", "."))) {
                    return -1 * sortPriceOrderNumber;
                } else {
                    return 1 * sortPriceOrderNumber;
                }
            });
            /*reverse the order of sort and reset order of other fields*/
            setOrdersNumbers(1, 1, sortPriceOrderNumber * -1, 1);
            break;
        case "quantity_header":
            rowsData.sort(function (a, b) {
                if (parseInt(a.quantity) <= parseInt(b.quantity)) {
                    return -1 * sortQuantityOrderNumber;
                } else {
                    return 1 * sortQuantityOrderNumber;
                }
            });
            /*reverse the order of sort and reset order of other fields*/
            setOrdersNumbers(1, 1, 1, sortQuantityOrderNumber * -1);
            break;
        default:
            console.error("Unidentified table header identifier.");
    }
    return rowsData;
}

function sortTable(tableHeaderId) {
    showLoadingPopUp();
    window.setTimeout(function () {
        /*store data in array of DatabaseRow*/
		var rowsData = getTableData();
        restoreEmptyTBody();
        rowsData = sortRowsData(rowsData, tableHeaderId);
        /*put back in html*/
        fillTableFromDatabaseRowArray(rowsData);
        hideLoadingPopUp();
    }, 150);
}

/**
 * Change the table so the rows with matching reference will be on top
 */
function searchReference() {
    showLoadingPopUp();
    /*add a delay before executing this in order to let browser display* the pop up*/
    window.setTimeout(function () {
        /*get the value of the search input*/
        var referenceString = document.getElementById(SEARCH_INPUT_ID).value;
        var rowsData = getTableData();
        restoreEmptyTBody();
        /*temp array who will hold matching references and unmatching separately*/
        var validArr = new Array();
        var invalidArr = new Array();
        var i;
        for (i = 0; i < rowsData.length; i++) {
            var currRow = rowsData[i];
            if (currRow.reference.startsWith(referenceString)) {
                validArr.push(currRow);
            } else {
                invalidArr.push(currRow);
            }
        }
        /*merge the arrays*/
        rowsData = new Array();
        for (i = 0; i < validArr.length; i++) {
            rowsData.push(validArr[i]);
        }
        for (i = 0; i < invalidArr.length; i++) {
            rowsData.push(invalidArr[i]);
        }
        /*and remake the table*/
        fillTableFromDatabaseRowArray(rowsData);
        hideLoadingPopUp();
    }, 150);
}

function breakDownSearch(searchString){
    /*we don't care about upper or lower case, so all will be lowered*/
    searchString = searchString.toLowerCase();
    /*useless words and most of puntuaction will be banned from search*/
    const bannedWords = ["je", "tu", "il", "nous", "vous", "ils", "le", "la", "les", "un",
     "une", "des", "du", "de la", "des", "ou", ",", ".", ":", ";"];
    /*so, remove all of these words in the searchString*/
    for(var i = 0; i < bannedWords.length; i++){
        searchString.replace(" " + bannedWords[i] + " ", " ");
    }
    /*split all words in a new array*/
    var words = searchString.split(" ");
    return words;
}

function searchDescription() {
    try {
        showLoadingPopUp();
        setTimeout(function () {
            /*get the value of the input and split it*/
            var searchField = document.getElementById(SEARCH_DESCRIPTION_ID).value;
            var searchWords = breakDownSearch(searchField);
            var rowsData = getTableData();
            for(var j = 0; j < searchWords.length; j++){
                console.log(searchWords[j]);
            }
            /*now, we will add a new attribute to each DatabaseRow containing a score*/
            for(var i = 0; i < rowsData.length; i++){
                var rowScore = 0;
                var row = rowsData[i];
                var rowDescritpion = row.description;
                for(var j = 0; j < searchWords.length; j++){
                    /*spaces beteween and after description in order to match only full words
                        (not words contained in other words, such as "des" in "despair")
                    */
                    var modifiedWord = rowDescritpion.toLowerCase();
                    /*Each word full matching will add a point in the total score*/
                    if(modifiedWord.includes(searchWords[j])){
                        rowScore++;
                    }
                }
                /*add this score in the DatabaseRow*/
                row.score = rowScore;
            }

            /*now that we have gathered all scores, we can sort the array of rows with it
                bigger score above*/
            rowsData.sort(function (a, b) {
                if (parseInt(a.score) <= parseInt(b.score)) {
                    return 1;
                } else {
                    return -1;
                }
            });
            /*and put back in html*/
            restoreEmptyTBody();
            fillTableFromDatabaseRowArray(rowsData);
            hideLoadingPopUp();
        }, 150);
    } catch (exception) {
        console.error(exception);
    }
}