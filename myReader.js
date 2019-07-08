let fs = require('fs');

// global.abc = 'abcdef';

let filePromise;

function getAllKeys() {
	// if(!filePromise) filePromise = readKeyFile(filename);
	if(!filePromise) return;
	console.log('get all key');
	let pro2 = filePromise.then(val=>{
		let keyRegex = /.+(?=\=)/gi;
		let valueRegex = /(?<=\=).+?\r/gi;
		let keyMatches = val.match(keyRegex);
		let valueMatches = val.match(valueRegex);
		let ob=[];
		for(let i=0;i<keyMatches.length;i++) {
			ob.push({key:keyMatches[i],value:valueMatches[i]});
		}
		return ob;
	})
	// pro2.catch(err=>{
		// if(err.errno == -4058) console.log('failed to find file');
		// else console.log(err)
	// });
	return pro2;
}

function getKey(keyName) {
	// if(!filePromise) filePromise = readKeyFile(filename);
	if(!filePromise) return;
	console.log('get key');
	let pro2 = filePromise.then(val=>{
		console.log('val : ',val);
		console.log('keyName : ',keyName);
		let keyIndex = val.indexOf(keyName+'=');
		if(keyIndex<0) throw new Error('key not found');
		val = val.substring(keyIndex);
		keyIndex = val.indexOf('\r');
		if(keyIndex<0) val=val.substring(keyName.length+1);
		else val=val.substring(keyName.length+1,keyIndex)
		return val;
	})
	// pro2.catch(err=>{
		// if(err.errno == -4058) console.log('failed to find file');
		// else console.log(err)
	// });
	return pro2;
}

function readKeyFile(filename) {
	let pro,res,rej;
	pro = new Promise((a,b)=>{res=a;rej=b;});
	fs.readFile(filename,{'encoding':'utf-8'},function (err,data){
		if(err) {
			// console.log(err);
			rej(err);
			return;
		} else {
			console.log('====================');
			console.log('data read :');
			console.log('--------------------');
			console.log(data);
			console.log('====================');
			res(data);
			return;
		}
	});
	filePromise = pro;
	// pro.catch(err=>{
		// if(err.errno == -4058) console.log('failed to find file');
		// else console.log(err)
		// });
	return filePromise;
}

module.exports = [readKeyFile,getAllKeys,getKey];


