$(document).ready(initializeApp);

var dataStorage = [{
	value: '',
	rank: '',
}];
var inputHistory = [];
var operators = ['+', '-', '*', '/'];
var calculated = false;

function initializeApp() {
	addClickHandlers();
}

function addClickHandlers() {
	$('.clear button').on('click', handleClearClick);
	$('.operators button').on('click', handleOperatorClick);
	$('.numbers button').on('click', handleNumberClick);
}

function handleClearClick() {
	if ($(this).text() === 'CE') {
		dataStorage.pop();
	} 
	if ($(this).text() === 'C') {
		dataStorage = [];
		insert(dataStorage);
	}
	updateDisplay(dataStorage);
}

function handleOperatorClick() {
	var operatorClicked = $(this).attr('value');
	var lastEntry = dataStorage[dataStorage.length-1];
	calculated = false;
	if ( operators.includes(lastEntry.value)) {
			lastEntry.value = operatorClicked; // only stores the last operator
	} else if ( lastEntry.value !== undefined){ 
		insert(dataStorage,operatorClicked, 2);
	}		
	updateDisplay(dataStorage);
}

function handleNumberClick() {
	var numberClicked = $(this).text();
	var lastEntry = dataStorage[dataStorage.length-1];
	if (numberClicked === '=') {
		handleEquals(dataStorage);		
	} else {
		if (numberClicked === '.'){
			if(lastEntry.value.toString().indexOf('.') === -1 && !operators.includes(lastEntry.value)) {
				storeValue(dataStorage,lastEntry.value += numberClicked, 1);
			} else if (operators.includes(lastEntry.value)){
				insert(dataStorage,numberClicked, 1);
			}
		} else if (isNumeric(numberClicked)) { 
			if (calculated) {
				dataStorage = [];
				insert(dataStorage);
				lastEntry = dataStorage[dataStorage.length-1];
				calculated = false;
			} 
			if ( lastEntry.value === undefined || !operators.includes(lastEntry.value)){
			storeValue(dataStorage,lastEntry.value += numberClicked, 1);
			} else if (operators.includes(lastEntry.value)){
				insert(dataStorage,numberClicked, 1);
			}
		} 
		updateDisplay(dataStorage);
	}
}

function isNumeric(num) {
	return !isNaN(parseFloat(num)) && isFinite(num);
}

function handleEquals(inputData) {
	var result;
	// inputHistory = JSON.parse(JSON.stringify(inputData));
	console.log('inputHistory',inputHistory);
	console.log('dataStorage',dataStorage);
	if(!calculated){	
		if (inputData[0].value === '' && inputData.length === 1) {		
			storeValue(inputData,'Ready', 1); // for 'missing operands'
			result = doMath(inputData);
		} else if(inputData.length === 2 && isNumeric(inputData[0].value) && operators.includes(inputData[1].value)){
			inputHistory = JSON.parse(JSON.stringify(inputData));
			var repeatData = JSON.parse(JSON.stringify(inputData[0]));
			console.log('repeatData:',repeatData);
			inputData.push(repeatData); 
			format(inputData);
			result = doMath(inputData);
			console.log(result);
		// } else if (inputData.length === 1 && inputData[0].value === '') {
		// 	storeValue(inputData, 'Ready', 1);
		// 	result = doMath(inputData);
		// 	inputData = [];
		// 	insert(inputData);
		}else {
			inputHistory = JSON.parse(JSON.stringify(inputData));
			format(inputData);
			result = doMath(inputData);
		}
	} else {
		if (operators.includes(inputData[inputData.length-1].value)){
			var repeatData = JSON.parse(JSON.stringify(inputData[inputData.length-2]));
			inputData.push(repeatData);
			format(inputData);
			result = doMath(inputData);
		} else if (inputData[0].value === 'Ready' && inputData.length === 1){
			storeValue(inputData,'Ready', 1); // for 'missing operands'
			console.log('rdy again');
			result = doMath(inputData);
			// inputData = [];
			// insert(); //bug
		} else {
			format(inputData);
			console.log('inputHistory after =:', inputHistory);
			var lastOperation = inputHistory.slice(inputHistory.length-2);
			console.log('lastOperation',lastOperation);
			var newData = inputData.concat(lastOperation);
			console.log(newData);
			result = doMath(newData);
		}
	}	
	updateDisplay(result);
	calculated = true;
}

function insert(inputData, value, rank) {
	var itemToAdd = {};
		itemToAdd.value = value || '';
		itemToAdd.rank = rank || '';
		inputData.push(itemToAdd);
}

function storeValue(inputData, value, rank) {
		inputData[inputData.length-1].value = value;
		inputData[inputData.length-1].rank = rank;
}

function getValue(dataSource) {
	var storedValue = [];
	for (var i = 0; i < dataSource.length; i++) {
		storedValue.push(dataSource[i].value);
	}
	return storedValue;
}

function format(inputData) {
	if (operators.includes(inputData[inputData.length-1].value)){
		inputData.pop();
	}

	while (inputData[0].value === '' || operators.includes(inputData[0].value)){
		inputData.shift();
	}
	
	for (var i = 0; i < inputData.length; i++) {
	 	if (inputData[i].value === '*' || inputData[i].value === '/'){
	 	inputData[i].rank = 3;
	 	} else if (!operators.includes(inputData[i].value)){
	 		inputData[i].value = parseFloat(inputData[i].value);
	 	}
	}
}

function updateDisplay(inputData){
	var displayMessage = getValue(inputData).join(' ');
	$('.screen').text(displayMessage);
}

function doMath(inputData) {
	for (var i = 0; i < inputData.length; i++){
		if (inputData[i].rank === 3){
			if (inputData[i].value === '*'){
				inputData[i-1].value *= inputData[i+1].value; 
				inputData.splice(i, 2);
			} else if (inputData[i].value === '/'){
				if (parseFloat(inputData[i+1].value) === 0) {
					inputData = [{
						value: 'Error'
					}];
				} else {
					inputData[i-1].value /= inputData[i+1].value; 
					inputData[i-1].value = Number(inputData[i-1].value).toFixed(6);
					inputData.splice(i, 2);
				}
			}
		}
	}
	for (var i = 0; i < inputData.length; i++) {
		if (inputData[i].rank === 2) {
			if (inputData[i].value === '+') {
				inputData[i-1].value = (parseFloat(inputData[i-1].value) + parseFloat(inputData[i+1].value)).toFixed(6);
			}
			if (inputData[i].value === '-') {
				inputData[i-1].value -= inputData[i+1].value; 
			}
			inputData.splice(i, 2);
			i -= 2;
		}
	}
	return inputData;
}
