console.log('worldMap.js');
let wmap

initLeaflet();

function initLeaflet() {
	wmap = L.map('weatherMap').setView([10,0],2);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(wmap);
	// L.marker()
	loadData();
}

function loadData() {
	let pro = fetch('/loadWeather');
	pro.then(val=>val.json()).then(val=>{
		console.log(val);
		for(let item of val) {
			L.marker([item.lat,item.lng]).addTo(wmap)
			.bindPopup(`weather:${item.weather}<br>temperature:${item.temperature}<br>`)
			.openPopup();
		}
	});
}