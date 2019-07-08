console.log('go');
const nfetch = require('node-fetch');
let mr = require('./myReader.js');
let darkskykey;
// darkskykeyPromise = mr[0]('key.env').then(val=>{
	// mr[2]('darkskykey').then(val=>{
		// console.log('d key ',val);
		// return val;
	// }
// });
// let darkskykeyPromise = mr[2]('darkskykey').then(val=>{
	// console.log('d key ',val);
	// return val;
// });

const ex = require('express');
const server = ex();
const publicMiddle = ex.static('./public');
const jsonMiddle = ex.json({'limit':'1mb'});
const dbConstructor = require('nedb');
const db = new dbConstructor('weather.db');
db.loadDatabase();

server.use(jsonMiddle);
server.use(publicMiddle);

server.get('/findWeather',(req,rsp)=>{
	console.log('got find weather request');
	console.log('typeof req.query.lat',typeof req.query.lat);
	let url = `https://api.darksky.net/forecast/${darkskykey}/${req.query.lat},${req.query.lng}?units=${req.query.units}`;
	console.log('url : ',url);
	let pro = nfetch(url,{'method':'get'});
	pro
	// .then(val=>console.log(val.text,val.txt));
	// .then(val=>val.text()).then(val=>JSON.parse(val))
	.then(val=>val.json())
	.then(val=>{
		// console.log('? ',val.currently);
		rsp.send(val.currently);
	}).catch(e=>{
		console.log(e);
		rsp.send({result:'error occured'});
	});
	// rsp.send('xx');
});

server.post('/saveWeather',(req,rsp)=>{
	console.log('got save weather request');
	// console.log('req : ',req);
	// console.log('typeof req.body.lat ',typeof req.body.lat);
	console.log('req.body : ',req.body);
	let rLat = String(req.body.lat);
	let rLng = String(req.body.lng);
	let rWeather = req.body.weather;
	let rTemperature = String(req.body.temperature);
	db.update(
		{lat:rLat,lng:rLng},
		{$set:{temperature:rTemperature,weather:rWeather}},
		(err,num,docs)=>{
			if(err) {
				console.log(err);
				rsp.send({'result':'update failed'});
				return;
			} else if(num) {
				console.log('updated entry : ',num);
				
				rsp.send({'result':'updated db total : '+num});
				return;
			} else {
				console.log('updated entry : ',num);
				db.insert({
					lat:rLat,
					lng:rLng,
					weather:rWeather,
					temperature:rTemperature
				},(err,docs)=>{
					if(err) {
						console.log(err);
						rsp.send({'result':'update failed'});
						return;
					}else {
						console.log('created ',docs);
						rsp.send({'result':'new entry created in db'});
						return;
					}
				})
			}
		}
	)
	// rsp.send('we got save weather request');
});

server.get('/loadWeather',(req,rsp)=>{
	console.log('got load weather data request');
	// let regex = /\d*/gi
	db.find({
		lat:{$regex:/\d+\.\d+/gi},
		lng:{$regex:/\d+\.\d+/gi}
	},

	(err,docs)=>{
		if(err) {
			console.log(err)
			rsp.send({result:'error occured while finding data'});
			return;
		} else if(docs) {
			console.log('found data : ',docs.length);
			console.log(docs);
			rsp.send(docs);
		} else {
			console.log('found data : ',docs.length);
			rsp.send({result:'no docs found '});
		}
	});
	// rsp.send('we got load weather request');
});

goo().catch(err=>{
	if(err.errno == -4058) console.log('failed to find file');
	else console.log(err)
	console.log('server failed to start');
});

async function goo() {
	let data = await mr[0]('key.env')
	darkskykey = await mr[2]('darkskykey');
	let port = process.env.PORT
	console.log(process.env);
	if(!port) {console.log('could not find evn port');port = 3000;}
	server.listen(port,()=>{
		console.log('===================');
		console.log('server listening port : ',port);
		console.log('dark sky key : ',darkskykey);
		console.log('===================');
	});
}

