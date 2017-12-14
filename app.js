'use strict';
//importing express
var express = require("express");
//saving express into app variable
var app = express();
//importing routes from routes.js
var routes = require("./routes");
//importing the model from models.js
//var model = require("./models");
//importing body parser for json
var jsonParser = require("body-parser").json;
//importing morgan for HTTP request logger middleware 
var logger = require("morgan");
app.use(logger("dev"));
app.use(jsonParser());
//mongoDB connection
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/qa");

var db = mongoose.connection;

db.on("error", function(err){
    console.error("connection error:", err);
});

db.once("open", function(err){
    console.log("connection successful");
    //All database communication goes here
});

//middleware for cross origin request
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
        return res.status(200).json({});
    }
    next();
})
//routes starting with questions
app.use("/questions", routes);

//middleware for 404 error
app.use(function(req, res, next){
    var err =  new Error("Not found");
    err.status = 404;
    next(err);
});
//middleware for error handler
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.json({
        error:{
            message: err.message
        }
    });
    next(err);
});
//assigning port
var port = process.env.PORT || 3000; //process.env.PORT will be for production
//running server
app.listen(port, function(){
    console.log("Server running on localhost:3000");
});