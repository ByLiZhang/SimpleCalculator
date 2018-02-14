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
	// console.log('number clicked');
	var numberClicked = $(this).text();
	dataStorage.push(numberClicked);
	updateDisplay(dataStorage);
}

function handleOperatorClick() {
	// console.log('operator clicked');
	var operatorClicked = $(this).text();
	if (dataStorage.length )
	dataStorage += operatorClicked;

	updateDisplay(dataStorage);
}

function handleClearClick() {
	// console.log('clear clicked');
	if ($(this).text() === 'C') {
		dataStorage.pop();
		updateDisplay(dataStorage);
	} else if ($(this).text() === 'CE') {
		dataStorage = [];
		updateDisplay(dataStorage);
	}
}

function updateDisplay(inputData){
	// $('.screen').text('');
	$('.screen').text(inputData);
}
