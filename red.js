
var redis = require('redis');
var fs = require('fs');
var converter = require('csvtojson').Converter;
var prompt = require('prompt');


console.log('Connected to redis...');
var client = redis.createClient(9709, 'ec2-54-83-59-218.compute-1.amazonaws.com'); 
	client.auth('p5fcd8r304r51r3ttkvtbktfncp');

client.on('connect', function(err){
	
	if (err) throw err;
//	console.log('Connected...');	
});

var csvfile = 'Players.csv_100';
var csv_con = new converter();

fs.createReadStream(csvfile).pipe(csv_con);


csv_con.on("end_parsed", function(jsonObj, err){
	
	if (err) throw err;
	for (var i = 0; i<jsonObj.length;i++){
		if (i == 0){
			
		client.hmset(jsonObj[i].Player_name,'Name',jsonObj[i].Player_name, 'DOB', jsonObj[i].DOB,'Country', jsonObj[i].Country,'Height', jsonObj[i].Height,
		'Club',jsonObj[i].Club,'Position',jsonObj[i].Position,'Caps', jsonObj[i].Caps,'Is_captain', jsonObj[i].Is_Captain, function(err){
			
			if (err) throw err;
			//console.log('hmset added');
		});
			
		}
		client.set(jsonObj[i].Player_id, jsonObj[i].Player_name, function(err, reply){
			
			if (err) throw err;
			//console.log(reply);
		});
		
		
	}
	
	//console.log('Data inserted');
	}); 

	prompt.start();
	prompt.get(['P_key','S_key'], function(err, res){
		
		if (err) throw err;
		
		client.get(res.P_key, function(err, rep){
			
			if (err) throw err;
			console.log(rep);
		});
	
		client.hgetall(res.S_key, function(err, res){
			
			if (err) throw err;
		//	console.log(res.S_key);
			console.log(res);
		});
		
	});

