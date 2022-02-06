const mongodb = require('mongodb')
const mongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"
var db;


var dbController = {
    connection: function () {
        mongoClient.connect(url, function (err, database) {
            if (err) {
                console.log("Err in database server connection")
                return
            }
            db = database.db("OLX")
            console.log("Mongo db connected.")
        })
    },

    viewallads: function (res) {
        var collection = db.collection("adDB")

        collection.find().sort({ createdDateTime: -1 }).toArray(function (err, result) {
            if (err) {
                console.log("Error")
                return
            }
            res.render("allads", { title: "List Of Ads", taskData: result, isMember: false })
        })
    },

    viewFullDetails: function (id, res) {
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
            var memberid = adData.memberid
            var filter2 = {
                "_id": mongodb.ObjectId(memberid)
            }
            var memberData = null;
            membercollection.find(filter2).toArray(function (err, result) {
                if (err) {
                    console.log("err")
                    return
                }
                result.forEach(element => {
                    memberData = element
                })
                res.render("guest-view-fulldata", { title: "view", 'data': adData, 'dataD': memberData })
            })
        })
    },

    contactMember: function (id, res) {

        var membercollection = db.collection("memberdb")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }

        membercollection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                memberData = element
            })
            res.render("contact", { title: "view", 'memberData': memberData })
        })

    },

}


module.exports = { dbController }
