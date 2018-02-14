$(document).ready(initializeApp);

var dataStorage = [];

function initializeApp() {
	addClickHandlers();
}

function addClickHandlers() {
	$('.numbers button').on('click', handleNumberClick);
	$('.operators button').on('click', handleOperatorClick);
	$('.clear button').on('click', handleClearClick);
}

function handleNumberClick() {
	var numberClicked = $(this).text();
	if (numberClicked === '=') {
		var result = doMath(dataStorage);
		displayResult(result);
	} else {
		dataStorage.push(numberClicked);
		updateDisplay(dataStorage);
	}
}

function handleOperatorClick() {
	var operatorClicked = $(this).text();
	if (dataStorage.length) {
		dataStorage.push(operatorClicked);
	}

	updateDisplay(dataStorage);
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

function updateDisplay(inputData){
	var message = inputData.join(' ');
	$('.screen').text(message);
}

function displayResult(inputData) {
	$('.screen').text(inputData);
	dataStorage = [];
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
		} else if (operators.includes(inputData[i]) && firstOperatorSeen) {
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