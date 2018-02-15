$(document).ready(initializeApp);

var dataStorage = [];

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
	updateDisplay(dataStorage);
}

function handleOperatorClick() {
	var operatorClicked = $(this).text();
	if (dataStorage.length) {
		dataStorage.push(operatorClicked);
	}
	updateDisplay(dataStorage);
}

function handleNumberClick() {
	var numberClicked = $(this).text();
	if (numberClicked === '=') {
		var input = partition(dataStorage);
		var result = doMath(input);
		displayResult(result);
	} else {
		var inputItem = {};
		inputItem.value = numberClicked;
		inputItem.rank = 1;
		console.log(inputItem);
		dataStorage.push(inputItem);
		console.log('dataStorage:', dataStorage);
		var inputValue = [];
		for (var i = 0; i < dataStorage.length; i++) {
			inputValue.push(dataStorage[i].value);
		}
		updateDisplay(inputValue);
	}
}

function partition() {
	// body...
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
	var operators = ['+', '-', '*', '/'];
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