$(document).ready(initializeApp);

var dataStorage = [{
	value: '',
	rank: '',
}];
var inputHistory = [];
var operators = ['+', '-', '*', '/'];
var displayMessage;
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
		insert('','');
	}
	updateDisplay(dataStorage);
}

function handleOperatorClick() {
	var operatorClicked = $(this).attr('value');
	var target = dataStorage[dataStorage.length-1];
	calculated = false;
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
		if(!calculated){
			format(dataStorage);
			inputHistory = dataStorage.slice();
			console.log(inputHistory);
			var result = doMath(dataStorage);
			updateDisplay(result);
		} else {
			console.log('inputHistory after =:', inputHistory);
			var lastOperation = inputHistory.slice(inputHistory.length-2);
			console.log('lastOperation',lastOperation);
			var newData = dataStorage.concat(lastOperation);
			console.log(newData);
			var result = doMath(newData);
			updateDisplay(result);
		}	
		calculated = true;	
	} else {
		if (numberClicked === '.'){
			if(target.value.toString().indexOf('.') === -1 && !operators.includes(target.value)) {
				storeValue(target.value += numberClicked, 1);
			} else if (operators.includes(target.value)){
				insert(numberClicked, 1);
			}
		} else if (numberClicked !== '.') {
			if (calculated) {
				dataStorage = [];
				insert();
				target = dataStorage[dataStorage.length-1];
				calculated = false;
			} 
			if ( target.value === undefined || !operators.includes(target.value)){
			storeValue(target.value += numberClicked, 1);
			} else if (operators.includes(target.value)){
				insert(numberClicked, 1);
			} else if (!calculated) {
				insert();
			}
		} 
		updateDisplay(dataStorage);
	}
}

function insert(inputData, rank) {
	var itemToAdd = {};
		itemToAdd.value = inputData || '';
		itemToAdd.rank = rank || '';
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
				inputData[i-1].value = parseFloat(inputData[i-1].value) + parseFloat(inputData[i+1].value); 
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
