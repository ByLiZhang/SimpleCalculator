$(document).ready(initializeApp);

var dataStorage = [];
var operators = ['+', '-', '*', '/'];
function initializeApp() {
	addClickHandlers();
}

function addClickHandlers() {
	$('.clear button').on('click', handleClearClick);
	$('.operators button').on('click', handleOperatorClick);
	$('.numbers button').on('click', handleNumberClick);
}

function handleClearClick() {
	if ($(this).text() === 'C') {
		dataStorage.pop();
	} 
	if ($(this).text() === 'CE') {
		dataStorage = [];
	}
	var storedValue = getValue(dataStorage);
	updateDisplay(storedValue);
}

function getValue(dataSource) {
	var storedValue = [];
	for (var i = 0; i < dataSource.length; i++) {
		storedValue.push(dataSource[i].value);
	}
	return storedValue;
}

function handleOperatorClick() {
	var operatorClicked = $(this).attr('value');
	var storedValue = [];
	if (dataStorage.length) {
		// when multiple operators were chain pressed - only keep the last one
		if(operators.includes(dataStorage[dataStorage.length-1].value)){
			dataStorage.pop();
		}
		storedValue = storeValue(operatorClicked, 2);
	}
	updateDisplay(storedValue);
}

function handleNumberClick() {
	var numberClicked = $(this).text();
	if (numberClicked === '=') {
		var input = partition(dataStorage);
		var result = doMath(input);
		displayResult(result);
	} else if (numberClicked === '.'){
		if (dataStorage.length && dataStorage[dataStorage.length-1].value !== '.' && !operators.includes(dataStorage[dataStorage.length-1].value)){
			//disallow meaningless '.'
		var storedValue = storeValue(numberClicked, 3);
		updateDisplay(storedValue);
		}
	} else {
		var storedValue = storeValue(numberClicked, 1);
		updateDisplay(storedValue);
	}
}

function storeValue(input, rank) {
	var inputItem = {};
	inputItem.value = input;
	inputItem.rank = rank;
	dataStorage.push(inputItem);
	var storedValue = getValue(dataStorage);
	return storedValue;
}

function partition() {
	
}

function updateDisplay(inputData){
	var message = inputData.join(' ');
	$('.screen').text(message);
}

function displayResult(inputData) {
	$('.screen').text(inputData);
	dataStorage = [inputData];
}

function doMath(inputData) {
	var num1 = '';
	var num2 = '';
	var firstOperatorSeen = false;
	var secondOperatorSeen = false;
	for (var i = 0; i < inputData.length; i++){
		if (operators.includes(inputData[i]) && !firstOperatorSeen){
			firstOperatorSeen = inputData[i]; 
		} else if (firstOperatorSeen && !secondOperatorSeen) {
			num2 += inputData[i];
		} else if (operators.includes(inputData[i]) && firstOperatorSeen && !secondOperatorSeen) {
			secondOperatorPostion = i;
		}
		else {
			num1 += inputData[i];
		}
	}
	if (firstOperatorSeen === '+') {
		return Number(num1) + Number(num2);
	} else if (firstOperatorSeen === '-') {
		return Number(num1) - Number(num2);
	} else if (firstOperatorSeen === '*') {
		return Number(num1) * Number(num2);
	} else if (firstOperatorSeen === '/' && num2 != 0) {
		return Number(num1)/Number(num2);
	} else {
		return 'Error';
	}
}