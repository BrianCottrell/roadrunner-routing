var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var accidents = [];
var tows = [];

var MojioClientLite= require("mojio-client-lite");

var config = {
    application: '17f02451-750f-4a7d-ab38-4e814a513ab0',
    secret:'a72670d2-62ad-45df-b8d5-41d4fcd84b47'
};

var mojio_client = new MojioClientLite(config);

var p = mojio_client.authorize('BrianCottrell','a171212').then(function(res,err){

    if(typeof(err)!="undefined")
    {
        console.log("login error");
        p.cancel();
        return;
    }

	console.log("login success", res);

	return mojio_client.get().vehicles();
})
.then(function(vehicles){
	for (var i = 0; i < vehicles.Data.length; i++) {
		if (vehicles.Data[i].AccidentState.Value == true) {
			accidents.push(vehicles.Data[i].Location.Lng)
			accidents.push(vehicles.Data[i].Location.Lat)
			console.log("Accident Added")
		}
	}
	for (var i = 0; i < vehicles.Data.length; i++) {
		if (vehicles.Data[i].TowState.Value == true) {
			accidents.push(vehicles.Data[i].Location.Lng)
			accidents.push(vehicles.Data[i].Location.Lat)
			console.log("Tow Added")
		}
	}
})

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.status(200).render('map_view');
});

app.get('/accidents', function(req, res) {
	res.status(200).send(accidents);
});

app.get('/tows', function(req, res) {
	res.status(200).send(tows);
});

app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));

app.listen(port);
console.log("Listening to port", port);
