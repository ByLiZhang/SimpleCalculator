$(document).ready(initializeApp);

function initializeApp() {
	$('.numbers button').on('click', handleNumberClick);
	$('.operators button').on('click', handleOperatorClick);
}

function handleNumberClick() {
	console.log('number clicked');
}

function handleOperatorClick() {
	console.log('operator clicked');
}