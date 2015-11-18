var mongoose = require('mongoose');
var fs = require('fs');
var converter = require('csvtojson').Converter;
var prompt = require('prompt');


console.log('Connected to MongoDb...');
mongoose.connect('mongodb://sam525:sam525@ds055574.mongolab.com:55574/heroku_vts4ljwt')
var conn = mongoose.connection;

conn.on('error', function(err){
	
	console.log('Connection error', err);
	});
conn.once('open', function(){
	
	//console.log('Connected...');
	});

var csvfile = 'Players.csv_100';
var csv_con = new converter();

fs.createReadStream(csvfile).pipe(csv_con);


csv_con.on("end_parsed", function(jsonObj){
	
	conn.collection('Players').insert(jsonObj);
	}); 


//console.log('Collection created and data inserted successfully...');
var Schema = mongoose.Schema;
var Players_100_schema = new Schema({Player_id : Number, Player_name : String, Firstname : String, Lastname : String, DOB : Number, 
				Country : String, Height : Number, Club : String, Position : String, Caps : Number, Is_captain : String});

var Player = mongoose.model('Player', Players_100_schema,'Players');

prompt.start();

prompt.get(['P_key','S_key'], function (err, result) {
   
   if (err) throw err;
   
   Player.find({'Player_id' : result.P_key}).exec(function(err, player){
	   
	   if(err) throw err;
	   console.log('%s',player);
	   //conn.close();
	   });
    
    Player.find({'Country' : result.S_key}).exec(function(err, player) {
       if(err) throw err;
	   console.log('%s',player);
	   conn.close();
	    
    });
	
});

