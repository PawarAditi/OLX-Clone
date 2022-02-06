const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const formidable = require('formidable')
const fs = require('fs')
var port = 3030

//loading express module
var app = express()

//creating subservers
var admin = express()
var member = express()

//loading bodyparser for input data from form
app.use(bodyParser.urlencoded({
    extended : true
}))

app.get("/", function (req, res) {
    //res.sendFile(__dirname + "/index.html")
    res.render('upload.ejs')
})
//mouting ejs files
admin.set("view engine", "ejs")
member.set("view engine" , "ejs")
app.set('view engine', 'ejs')
//creating session for sub-servers
admin.use(session({
    secret : "admin",
    resave : true,
    saveUninitialized : true
}))

member.use(session({
    secret : "admin",
    resave : true,
    saveUninitialized : true
}))

//mouting admin & member
app.use("/admin" , admin)
app.use("/member" , member)
app.use(express.static('public')); //localhost:port/public


//creating route mapping for admin & member
var adminRoute = require("./services/admin-route")
var memberRoute = require("./services/member-route")
var routes = require("./services/routes")

//loading routes to subserver
adminRoute(admin)
memberRoute(member)
routes(app)

app.listen(port, function(err,result){
    if(err){
        console.log("Error in initizaling");        
        return
    }
    console.log("Server started at " + port);
})
