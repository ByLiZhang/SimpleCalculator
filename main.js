$(document).ready(initializeApp);

var dataStorage = [{
	value: ' ',
	rank: ' ',
}];
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
	} else if ( target.value !== ' '){ 
		insert(operatorClicked, 2);
	}		
	updateDisplay(dataStorage);
}

function handleNumberClick() {
	var numberClicked = $(this).text();
	var target = dataStorage[dataStorage.length-1];
	if (numberClicked === '=') {
		var input = partition(dataStorage);
		var result = doMath(input);
		displayResult(result);
		dataStorage = []; //clear input before next calculation 		
	} else if (numberClicked === '.'){
		if(target.value.indexOf('.') === -1 && !operators.includes(target.value)) {
			storeValue(target.value += numberClicked, 1);
		} else if (operators.includes(target.value)){
			insert(numberClicked, 1);
		}
	} else if (numberClicked !== '.') {
		if (!operators.includes(target.value)){
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

function partition() {
	
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