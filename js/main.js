var socket = io();

var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
	    $scope.searchtext= "";

	});
$(document).ready(function(){ //angular

	
	

});

$(document).ready(function(){
	console.log('document ready');



// itemID: String,
// 	description: String,
// 	URL: String,
// 	name: String,
//     numberOfRatings: number,
// 	rating: number,
// 	dateAdded:

		
	$('#button').click(function(){
	var msg=
	{
  		itemID: Math.floor(Math.random()*10000000000000000),
  		description: $('#description').val(),
  		URL: $('#URL').val(),
  		name: $('#name').val(),
  		rating: $('#rating').val(),
  		categoryID: $('#categoryID').val(),
  		numberOfRatings: $('#numberOfRatings').val()
	}
  		console.log(msg);
		socket.emit('button clicked', msg);
	});

	$('#refreshButton').click(function(){
		socket.emit('get items');
	});

	// $('#messageField').keypress(function(event){
	// 	var msg=
	// 	{
	 //  			first: $('#firstNameField').val(),
	 //  			last: $('#lastNameField').val(),
	 //  			message: $('#messageField').val()
	// 	}
		
	// 	if(event.which == '13'){
	// 		socket.emit('button clicked', msg);
	// 	}
	// });

	socket.on('button was clicked', function(msg){
		console.log('successful add');
		//$('#chat').append('<li>'+msg.first+ " " + msg.last+ ": " +msg.message+'</li>');
	});


	socket.on('item list', console.log('itemList'));
});


