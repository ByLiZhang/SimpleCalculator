$(document).ready(initializeApp);

var dataStorage = [{
	value: '',
	rank: '',
}];
var operators = ['+', '-', '*', '/', '>>'];

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
	}
	updateDisplay(dataStorage);
}

function handleOperatorClick() {
	var operatorClicked = $(this).attr('value');
	var target = dataStorage[dataStorage.length-1];
	if ( operators.includes(target.value)) {
			target.value = operatorClicked; // only keep the last operator
	} else if ( target.value !== undefined){ 
		insert(operatorClicked, 2);
	}		
	updateDisplay(dataStorage);
}

function handleNumberClick() {
	var numberClicked = $(this).text();
	var target = dataStorage[dataStorage.length-1];
	if (numberClicked === '=') {
		format(dataStorage);
		var result = doMath(dataStorage);
		updateDisplay(result);
		insert('>>', 2);
	} else if (numberClicked === '.'){
		if(target.value.toString().indexOf('.') === -1 && !operators.includes(target.value)) {
			storeValue(target.value += numberClicked, 1);
		} else if (operators.includes(target.value)){
			insert(numberClicked, 1);
		}
	} else if (numberClicked !== '.') {
		if ( target.value === undefined || !operators.includes(target.value)){
		storeValue(target.value += numberClicked, 1);
		} else if (operators.includes(target.value)){
			insert(numberClicked, 1);
		}
	} 
	updateDisplay(dataStorage);
}

function insert(inputData, rank) {
	var itemToAdd = {};
		itemToAdd.value = inputData;
		itemToAdd.rank = rank;
		dataStorage.push(itemToAdd);
}

function storeValue(input, rank) {
		dataStorage[dataStorage.length-1].value = input;
		dataStorage[dataStorage.length-1].rank = rank;
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
	for (var i = 0; i < inputData.length; i++) {
	 	if (inputData[i].value === '*' || inputData[i].value === '/'){
	 	inputData[i].rank = 3;
	 	} else if (!operators.includes(inputData[i].value)){
	 		inputData[i].value = parseFloat(inputData[i].value);
	 	}
	}
}

function updateDisplay(inputData){
	var message = getValue(inputData).join(' ');
	$('.screen').text(message);
}

function displayResult(inputData) {
	$('.screen').text(inputData);
	dataStorage = [inputData];
}

function doMath(inputData) {
	for (var i = 0; i < inputData.length; i++){
		if (inputData[i].rank === 3){
			if (inputData[i].value === '*'){
				inputData[i-1].value *= inputData[i+1].value; 
			} else if (inputData[i].value === '/'){
				if (inputData[i+1].value == 0) {
					updateDisplay(['Error']);
				} else {
					inputData[i-1].value /= inputData[i+1].value; 
				}
			}
			inputData.splice(i, 2);
		}
	}
	for (var i = 0; i < inputData.length; i++) {
		if (inputData[i].rank === 2) {
			if (inputData[i].value === '+') {
				inputData[i-1].value += inputData[i+1].value; 
			}
			if (inputData[i].value === '-') {
				inputData[i-1].value -= inputData[i+1].value; 
			}
			inputData.splice(i, 2);
		}
	}
	return inputData;
}