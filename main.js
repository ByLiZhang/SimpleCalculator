$(document).ready(initializeApp);

function initializeApp() {
	addClickHandlers();
}

function addClickHandlers() {
	$('.numbers button').on('click', handleNumberClick);
	$('.operators button').on('click', handleOperatorClick);
	$('.clear button').on('click', handleClearClick);
}

function handleNumberClick() {
	console.log('number clicked');
}

function handleOperatorClick() {
	console.log('operator clicked');
}

function handleClearClick() {
	console.log('clear clicked');
}