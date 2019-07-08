console.log('cWeather.js');
let weatherButton = document.getElementById('findWeather');
let saveButton = document.getElementById('saveWeather');
let weatherBoard = document.getElementById('currentWeather');
let temperatureBoard = document.getElementById('currentTemperature');
weatherButton.addEventListener('click',findWeather);
saveButton.addEventListener('click',saveWeather);
saveButton.disabled = true;
let lat,lng;
let unit = 'si';
let posPromise,posRes,posRej;
let cLat,cLng,cWeather,cTemperature;
posPromise = new Promise((a,b)=>{posRes=a;posRej=b});

try {
	navigator.geolocation.getCurrentPosition((val)=>{
		posRes({lat:lat = val.coords.latitude,lng:lng = val.coords.longitude})
	});
} catch(e) {
	posRej(e);
}
posPromise.then(val=>{
	cLat = val.lat;
	cLng = val.lng;
	console.log('geolocation : ',cLat,cLng);
});

// function findCurrentLocation() {
	
// }

async function findWeather() {
	if(!posPromise) return;
	weatherButton.disabled = true;
	console.log('unit ',unit);
	let loc = await posPromise;
	let lat = loc.lat;
	let lng = loc.lng;
	let pro = fetch(`/findWeather?lat=${lat}&lng=${lng}&units=${unit}`,{'method':'get'});
	let weatherPromise = pro.then(val=>val.json()).then(val=>{console.log('got response : ',val);return val;}).then(val=>{
		cWeather = val.summary;
		cTemperature = val.temperature;
		
		weatherBoard.innerHTML = `${val.summary}`;
		let degSymbol;
		console.log('unit ',unit);
		if(unit === 'si') degSymbol = '&deg;C';
		else if(unit === 'us') degSymbol = '&deg;F';
		else degSymbol = '&deg;Z'
		temperatureBoard.innerHTML = `${val.temperature} ${degSymbol}`;
		weatherButton.disabled = false;
		saveButton.disabled = false;
	});
}

async function saveWeather() {
	saveButton.disabled = true;
	let url = '/saveWeather';
	let pro = fetch(url,{
		'method':'post',
		'body':JSON.stringify({lat:cLat,lng:cLng,weather:cWeather,temperature:cTemperature}),
		'headers':{
			'Content-Type':'Application/json'
			}
		});
	pro.then(val=>val.json()).then(val=>{console.log('post reply ',val);return val;});
}


















