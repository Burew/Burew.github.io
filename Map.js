//load restaurant locations and put them in locationList
var locationList = [];

//Creating the map
var startPosition = {lat: 33.640, lng: -117.844}, //this is UCI's location
	markers = [], 
	map, 
	infowindow,
	contentString = 'UCI, where stuff happens';

function initMap() {
	console.log('InitMap Called');
	map = new google.maps.Map(document.getElementById('map'), {
	zoom: 15,
	center: startPosition
	});	
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		startPosition = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		
		//reset markers
		markers = [];
		map.setCenter(startPosition);
		addMarkerAndInfo(startPosition, contentString);
		loadPlacesFromAPI(startPosition);
		console.log("First load done");
		return;
		}, function() {
			console.log("User denied geolocation request");
		});
		console.log("Geolocation Finished!")
	}
	map.setCenter(startPosition);
	addMarkerAndInfo(startPosition, contentString);
	loadPlacesFromAPI(startPosition);
	console.log("Second load done")
}

function loadPlacesFromAPI(startPosition){
	console.log("loadPlaces called with a startPosition of: ", startPosition);
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location: startPosition,
		radius: 1500, //in meters
		type: ['restaurant']
	}, callback)
}

function callback(data, status){
	if (status === google.maps.places.PlacesServiceStatus.OK){
		locationList = [];
		for (var i = 0; i < data.length ; i++){
			locationList.push([data[i].name, data[i].geometry.location]);
			//console.log("Current array: ", locationList[i]);
		}
	}
}

//might only need to make function call on LAST marker when 'deleting' markers
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

	
function addMarkerAndInfo(location, contentString){		
	console.log("Add Marker,Info w/ a start point of: ", location);
	//add markers
	markers.push(new google.maps.Marker({
		position: location,
		map:map
		})
	);
	
	//add infowindow
	infowindow = new google.maps.InfoWindow({
		content: contentString
	});
	
	//make infoWindow popup when marker clicked
	markers[markers.length -1].addListener('click', function() {
		infowindow.open(map, markers[markers.length -1]);
	});
}
	
function getRandomInt(min, max) {   //inclusive rand function
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findRandRestaurant(){
	//get rand restaurant from locationList
	var temp = locationList[getRandomInt(0, locationList.length - 1 )];
	if (temp){
	
		//clear previous markers
		setMapOnAll(null);
		
		//add marker to map
		addMarkerAndInfo(
			temp[1], 	//location
			temp[0]		//contentstring
		);
		
		//center map to new location
		map.setCenter(temp[1]);
		
		//display result text to user
		$("#resultText").text("" + temp[0]);
	}
	
	else{
		console.log('Nothing to see here');
	}
}

$('#findRestButton').click(function(){
		findRandRestaurant();
});

var directionsDisplay, directionsService;

function initMapDirections() {
	directionsDisplay = new google.maps.DirectionsRenderer,
	directionsService = new google.maps.DirectionsService;
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('right-panel'));
	calculateAndDisplayRoute(directionsService, directionsDisplay);
	
	document.getElementById('mode').addEventListener('change', function() {
	calculateAndDisplayRoute(directionsService, directionsDisplay);
	});
	
	$("#right-panel").css("background-color", "#FCFBE3");
	
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
	var selectedMode = document.getElementById('mode').value;
	
	directionsService.route({
	origin: markers[0].position,  
	destination: (markers[markers.length -1 ]).position,
	// Note that Javascript allows us to access the constant
	// using square brackets and a string value as its
	// "property."
	travelMode: google.maps.TravelMode[selectedMode]
	}, function(response, status) {
	if (status == 'OK') {
	directionsDisplay.setDirections(response);
	} else {
	window.alert('Directions request failed due to ' + status);
	}
	});
}
		
$('#navigateButton').click(function(){
	if (directionsDisplay){
		calculateAndDisplayRoute(directionsService, directionsDisplay);
	}
	else{
		initMapDirections();
		//$("#map").css("margin-left", "10%");
	}
});

