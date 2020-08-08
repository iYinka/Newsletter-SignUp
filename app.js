//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

//Creating an express app
const app = express();

app.use(express.static("public")); //Inorder to effect some local changes made to get some CSS done locally and also image
app.use(bodyParser.urlencoded({extended: true})); 



app.get("/", function(req, res){
	res.sendFile(__dirname + "/signup.html");
});



app.post("/", function(req, res){
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const mail = req.body.email;


	const data =  {
		members: [
			{
			  email_address: mail,
			  status: "subscribed",
			  merge_fields: {
			  	FNAME: firstName,
			  	LNAME: lastName,
			  }
			}
		]
	};
	const jsonData = JSON.stringify(data);


	const url = "https://us17.api.mailchimp.com/3.0/lists/ba919b3dda"; //according to mailchimp site the after the endpoint comes the {list_id}
	const options = {
		method: "POST",
		auth: "victor1:d6fd39931140312bcf622c6293c0785e-us17",
	}

	const request = https.request(url, options, function(response){

		if(response.statusCode ===200){
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}


		response.on("data", function(data){
			console.log(JSON.parse(data));
		})
	});

	request.write(jsonData);
	request.end()

	//console.log(firstName, lastName, mail);    //Don't forget action = "/" as is for app.post("/", fxn) & method = "post" in the form in the respective .html 
});


//API Key created from mailchimp.com(my username is iYinka)
//d6fd39931140312bcf622c6293c0785e-us17  . Url is edited with "us17" replacing "server" as copied with the endpoint


//List ID
//ba919b3dda



app.post("/failure", function(req, res){
	res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Server is currently running on port 3000");
});
