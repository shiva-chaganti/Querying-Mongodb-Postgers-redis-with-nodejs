var fs = require('fs');
var pg = require('pg');

var converter = require('csvtojson').Converter;
var prompt = require('prompt');


var connect = process.env.DATABASE_URI || 'postgres://mmwtlvtjdxzmyb:dqC1zBiWdAja9UmtD5Zh6XIGQd@ec2-107-21-223-72.compute-1.amazonaws.com:5432/d54nr88au0lh81?ssl=true';


var client = new pg.Client(connect);
console.log('Connected to postgres...');
client.connect(function(err, client){
	
	if (err) throw err;
    });
	
	var query2 = client.query('CREATE TABLE Players_2(Player_id VARCHAR(15), Player_name VARCHAR(40), Firstname VARCHAR(40), Lastname VARCHAR(40), DOB VARCHAR(40), Country VARCHAR(40), Height VARCHAR(40), Club VARCHAR(40), Position VARCHAR(40), Caps VARCHAR(40), Is_Captain VARCHAR(40))');
	query2.on('end', function(){
	var csvfile = 'Players.csv_100';
	var csv_con = new converter();

	fs.createReadStream(csvfile).pipe(csv_con);
	csv_con.on("end_parsed", function(jsonObj){
		
		for(var i = 0; i<jsonObj.length;i++){
		
		client.query('INSERT INTO Players_2(Player_id, Player_name,Firstname,Lastname,DOB,Country,Height,Club,Position,Caps,Is_Captain) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', 
		[jsonObj[i].Player_id, jsonObj[i].Player_name, jsonObj[i].Firstname,jsonObj[i].Lastname,jsonObj[i].DOB,jsonObj[i].Country,jsonObj[i].Height,
		jsonObj[i].Club,jsonObj[i].Position,jsonObj[i].Caps,jsonObj[i].Is_Captain],function(err){
			
			if(err) throw err;
		});
			
		}
	});
	});
		 prompt.start();
		 prompt.get(['P_Key', 'S_key'], function(err, result) {
		 
		  if (err) throw err; 
		  
		  var query = client.query('SELECT Player_name FROM Players_2 WHERE Player_id = $1',[result.P_Key]);
		  	
		  	query.on('row', function(row, result){
		    result.addRow(row);
		  });
		 query.on('end', function(result){
		    
		   console.log(result.rows[0]);
		    
		 });
		 
		  
		  var query1 = client.query('SELECT Player_name FROM Players WHERE Country = $1',[result.S_key]);
		  
		  query1.on('row', function(row1, result1){
		    result1.addRow(row1);
		  });
		 query1.on('end', function(result1){
		    
		   console.log(result1.rows);
		   client.end();
		 });
		 
		 });