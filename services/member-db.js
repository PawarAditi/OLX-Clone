const mongodb = require('mongodb')
const mongoClient = require('mongodb').MongoClient
const fs = require('fs');

var url = "mongodb://localhost:27017"
var db;

function loginUser(email,password){
    var collection = db.collection("memberdb")
    var filter = {
        "email" : email,
        "password" : password
    }
    var userData = collection.findOne(filter)
    console.log("In login email : " , email);
    console.log("In login password : " , password);
    return userData;
}

function getUserByEmail(email){
    var collection = db.collection("memberdb")
    var filter = {
        "email" : email
    }
    var userData = collection.findOne(filter)
    return userData;
}
/*function viewAds(id)
{
    var collection = db.collection("adDB")
    var filter = {
        'memberid' : id
    }
    //var ad = collection.find(filter).toArray(function(err,res){})
    var ad = collection.findOne(filter)
    return ad
}*/

function addAds(req, form,id)
{
    console.log("inside controller")
    //getting collection
    var collection = db.collection("adDB")

    form.parse(req, function(err, fields, files){
        console.log("inside formidable function")
        //collecting information about the file upload
        var oldPath = files.adimage.filepath; //temp location 
        var extension = files.adimage.originalFilename.split('.').pop()

        //adding text to db
        var name = fields.adname
        var description = fields.addescription
        var price = fields.adprice

        console.log("name : ", name)
        console.log("description : ", description)

        //preparing time informartion
        var timestamp = Date.now();
        var currentDateTime = new Date();  

        //insert to db
        var adData = {
            "name" : name,
            "description" : description,
            "price" : price,
            "memberid": id,
            'image' : extension,
            'timestamp' : timestamp,
            'adDateTime' : currentDateTime
           
        }
        collection.insertOne(adData)
        var adId = adData._id //new id generated //_id.exten ::: for eg: 123123123123.png
        //u want to show a full details of ad
        //ip: ad._id
        //u can get the advertise detail from db using ad id
        //retrieved ad, u can get ad.image (extension)
        //_id.extension

        var newFileNameName = "./public/image/" + adId + "." + extension;

        //read
        fs.readFile(oldPath, function(err, data){
            if(err)
            {
                console.log("Error in upload : ", err)
                return
            }
            //write
            fs.writeFile(newFileNameName, data, function(err){
                if(err)
                {
                    console.log("Error in upload2 : ", err)
                    return   
                }
            })
        })

    })

}
function reuploadImgAd(req, form, currloginUser) {
    //getting collection
    dbController.connection()    
    form.parse(req, function (err, fields, files) {
        //collecting information about the file upload
        var collection = db.collection("ads")
        var selectedId = fields.id
        var filter = {
            "_id": mongodb.ObjectId(selectedId)
        }
        console.log("id to filter "+selectedId)
        var oldPath = files.filetoupload.filepath; //temp location 
        var extension = files.filetoupload.originalFilename.split('.').pop()
        console.log(extension)
        var adData = {
            $set: {
                'image': extension
            }
        }
        collection.updateMany(filter, adData, function (err, result) {
            if (err) {
                console.log("err in update")
                return
            }
        })
        var adId = fields.id
        var newFileNameName = "./public/image/" + adId + "." + extension;
        fs.readFile(oldPath, function (err, data) {
            if (err) {
                console.log("Error in upload : ", err)
                return
            }
            //write
            fs.writeFile(newFileNameName, data, function (err) {
                if (err) {
                    console.log("Error in upload : ", err)
                    return
                }
            })
        })

    })
}

var dbController = {
    connection : function(){
        mongoClient.connect(url,function(err,database){
            if(err){
                console.log("Error in database" + err);
                return
            }
            db = database.db("OLX")
            console.log("Database connected member");
        })
    },
    addMember : function(data){
        var collection = db.collection("memberdb")
        collection.insertOne(data, function(err,result){
            if(err){
                console.log("Err in adding")
                return
            }
            console.log("Added")
        })
    },
    //Delete all ads
    deleteAllAds : function(id){
        
        var collection = db.collection("adDB")
        var filter = {
            "memberid": id
        }
        collection.deleteMany(filter,function (err, result) {
            if (err) {
                console.log("Err in delete ", err)
                return
            }
            console.log("Ads deleted")
        })
    },
    //Delete account
    deleteAccount : function(memberid){
        var collection = db.collection("memberdb")
        var memberFilter = {
            "_id" : mongodb.ObjectId(memberid)
        }
        var adFilter = {
            "memberid" : memberid
        }
        collection.deleteOne(memberFilter, function(err,result){
            if(err){
                console.log("Error in memberdb delete");
                return
            }
            console.log("Delete from MemberDB");
            var adCollection = db.collection("adDB")
            adCollection.deleteMany(adFilter,function(err2,result2){
                if(err2){
                    console.log("Error in adDB delete");
                    return
                }
                console.log("Delete ads");
               // res.render("member-login")
            })
        })
    },
    //delete one ad
    deleteAds : function(selectedId){
        var whereClause = {
            "_id" : mongodb.ObjectId(selectedId)
        }
        var collection = db.collection("adDB")
        collection.deleteOne(whereClause, function(err, result){
            if(err)
            {
                console.log("err in delete")
                return
            }
            
        
        }) 
    },
    //update profile
    updateProfile : function(memberid,res){
        var collection = db.collection("memberdb")
        
        var filter = {
            "_id" : mongodb.ObjectId(memberid)
        }
        console.log("in db" , mongodb.ObjectId(memberid));
        var stdata=null;
          
        collection.find(filter).toArray(function(err,result){
            if(err){
                console.log("Err in updating")
                return
            }
            result.forEach(element => {
                stdata = element
            })
            
            res.render("member-update-profile" , {data:stdata})
            console.log(stdata)
        })
        
    },
    //update profile post
    updateProfileData : function(memberid,res,req){
        var collection = db.collection("memberdb")
        var id = req.body.memberid
        var fname = req.body.fname
        var lname = req.body.lname
        var phone = req.body.phone
        var address = req.body.address
        var pincode = req.body.pincode
        var email = req.body.email
        

        var passdata = {
            $set :  {
                "_id":id,
                "fname": fname,
                "lname": lname,
                "email": email,
                "phone": phone,
                "address" : address,
                "pincode" : pincode
            }
        }
        console.log(passdata);
        var whereclause = {
            "_id" : mongodb.ObjectId(id)
        }
        collection.updateMany(whereclause,passdata, function(err, data){
            if(err)
            {
                console.log("Err in update : ", err)
                return
            }  
        })
       // res.redirect("/staff/viewstudents")
    },
    updatePasswordData : function(id,res,req){//memerid
        var password = req.body.password

        var passdata = {
            $set :  {
                "password":password
            }
        }
        var whereclause = {
            "_id" : mongodb.ObjectId(id)
        }
        var collection = db.collection("memberdb")
        collection.updateMany(whereclause,passdata, function(err, data){
            if(err)
            {
                console.log("Err in update : ", err)
                return
            }  
        })
    },
   /* updatePasswordData : function(data,res){
        var selectedId = data.id
        var collection = db.collection("memberdb")
        var filter = {
            "_id" : mongodb.ObjectId(selectedId)
        }
        var jsonData = {
            $set : {
                password : data.password
            }
        }
        collection.updateOne(filter,jsonData,function(err,result){
            if(err){
                console.log("Err in update password post");
                return
            }
            console.log("Password updated");
        })
    },*/
    
    updatecontent: function (id, res) {
        var collection = db.collection("adDB")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        console.log(newId + "db");
        var adData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                adData = element
            })            
            res.render("update-ad", { title: "view", data: adData })
        })
    },

    updatecontentpost: function (req, res) {
        var id = req.body.id
        var name = req.body.name
        var description = req.body.description
        var price = req.body.price

        var frtdata = {
            $set :  {
                "id":id,
                "name" : name,
                "description" : description,
                "price" : price,
            }
        }
       
        var whereclause = {
            "_id" : mongodb.ObjectId(id)
        }
        var collection = db.collection("adDB")
    
        collection.updateMany(whereclause, frtdata, function(err, data){
            if(err)
            {
                console.log("Err in update : ", err)
                return
            }    
        })
    },
    viewAds : function (res, id) {
        var collection = db.collection("adDB")
        var filter = {
            "memberid": id
        }
        collection.find(filter).sort({ createdDateTime: -1 }).toArray(function (err, result) {
            if (err) {
                console.log("Error")
                return
            }
            res.render("member-ads", { title: "List Of Ads", taskData: result, isMember: true })
        })
    },
    reuploadImgView: function (id, res) {
        var collection = db.collection("adDB")
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
            res.render("reuploadImg", { title: "view", data: adData })
        })
    },
    deleteInfo : function(id,res){
        var collection = db.collection("adDB")
        var filter = {
            "_id" : mongodb.ObjectId(id)
        }
        collection.deleteOne(filter,function(err,data){
            if(err){
                console.log("Err while deleting")
            }
            console.log("Ad deleted")
            res.render("member-ads", {title: "view page", data : data})
        }) 
    },

}
module.exports = {loginUser,dbController,getUserByEmail,addAds,reuploadImgAd}