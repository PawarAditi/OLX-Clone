const mongodb = require('mongodb')
const mongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"
var db;

function loginUser(email,password){
    var collection = db.collection("admindb")
    var filter = {
        "email" : email,
        "password" : password
    }
    var userData = collection.findOne(filter)
    console.log("In login email : " , email);
    console.log("In login password : " , password);
    return userData;
}

var dbController = {
    connection : function(){
        mongoClient.connect(url,function(err,database){
            if(err){
                console.log("Error in database" + err);
                return
            }
            db = database.db("OLX")
            console.log("Database connected");
        })
    },
    viewMembers : function(res){
        var collection = db.collection("memberdb")
        collection.find().toArray(function(err,result){
            if(err){
                console.log("Err in view")
                return
            }
            res.render("admin-view-member", {title: "view page", data : result})
        })
    },
    viewFullData : function(res,id){
        var mCollection = db.collection("memberdb")
        var adCollection = db.collection("adDB")
        var filter = {
            "_id": mongodb.ObjectId(id)
        }
        var filter2 = {
            "memberid": id
        }
        mCollection.find(filter).toArray(function (err, result1) {
            if (err) {
                console.log("Error")
                return
            }
            adCollection.find(filter2).toArray(function (err, result2) {
                if (err) {
                    console.log("Error")
                    return
                }
                res.render("admin-view-fulldata", { title: "Full Member Details", data: result1, dataA: result2 })
            })
        })
    },
    viewAds : function(id,res){
        var collection = db.collection("adDB")
        var filter = {
            "memberid" : mongodb.ObjectId(id)
        }
        collection.find().toArray(function(err,result){
            if(err){
                console.log("Err in view")
                return
            }
            res.render("admin-view-ads", {title: "view page", dataA : result})
        })
    },
    requestmore: function (id, res) {
        var collection = db.collection("adDB")
        var membercollection = db.collection("memberdb")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var adData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                adData = element
            })
            var memberData = null
            var memberid = adData.memberid
            var filter2 = {
                "_id": mongodb.ObjectId(memberid)
            }
            membercollection.find(filter2).toArray(function (err, result) {
                if (err) {
                    console.log("err")
                    return
                }
                result.forEach(element => {
                    memberData = element
                })
                res.render("admin-request", { title: "view", adData: adData, memberData: memberData })
            })
        })
    }






}

module.exports = {loginUser,dbController}