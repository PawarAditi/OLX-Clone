const dbController = require("./member-db")
const emailController = require("./mail-service")
const formidable = require('formidable')

dbController.dbController.connection()
var loginUser;
var currloginUser;

var controller = {
    
    /*home : function(req,res){
        if(req.session.login){
            res.render("member-home" , {title : "Member home page"})
        }
        else{
            res.render("member-login" , {title : "Member Login Page"})
        }
    },*/
    login : function(req,res){
       res.render("member-login" ,{title : "Member Login page" , data:null})
    },
    loginverify : async function(req, res){
        //colletion data from req (form)
        var email = req.body.email
        var password = req.body.password
        console.log("Email : ", email)
        console.log("Password : ", password)
        /*
        //call a method from db-staff :: to check whether any user with given email and password
        dbController.dbController.getLoingUser(email, password, req, res)
        */
        var userData = await dbController.loginUser(email, password)
       // console.log("userData : ", userData)
        loginUser = userData
        currloginUser = userData._id.toString()
        if (userData != null)
        {
            res.render("member-home", {title : "Member Home Page", data : userData,imageUrl : null})
        }
        else
        {
            res.render("member-login", {title : "Member Login Page"})
        }
    },
    logout : function(req,res){
        req.session.destroy(function(err){
            console.log("Session destroy");
        })
        res.render("member-login", {title : "Member Login Page"})
    },
    forgotView : function(req, res){
        res.render("member-forgot-password", {title : "Member Forgot Password Page"})
    },
    sendPassword : async function (req,res) {
        var email = req.body.email
        var user = await dbController.getUserByEmail(email)
        if(user == null){
            res.send("Invalid email address")
        }
        else{
            var password = user.password
            emailController.send(email, "adpawar18@gmail.com","Password Recovery","Password of user :" + "<b>" + password +"</b>")
            res.render("member-login",{title : "Member Login Page"})
        }
    },
    register : function(req,res){
        res.render("member-register", {title : "Register Member"})
    },
    home : function(req,res){
        res.render("member-home")
    },
    addmember : function(req,res){
        var member = {
            fname : req.body.fname,
            lname : req.body.lname,
            email : req.body.email,
            phone : req.body.phone,
            address : req.body.address,
            pincode : req.body.pincode,
            password: req.body.password
        }
        dbController.dbController.addMember(member)
        res.render("member-login",{title : "Login Page"})
    },
    /**************************/
//ad get
    addAd : function(req,res){
       // var id = req.params.id
        res.render('member-new-ad',{title : "Add new Ad"})//, id:id})
    },
    addAdpost : async function(req, res){
        var id = currloginUser
        console.log("inside controller function")
        var form = new formidable.IncomingForm();
        dbController.addAds(req, form,id) 
        res.render("member-home", {title: "Member home page"})
    },

    viewads: async function (req, res) {
        var id = currloginUser
        await dbController.dbController.viewAds(res, id)
    },

    //Delete All
    deleteall : function(req,res){
        var id = currloginUser
        dbController.dbController.deleteAllAds(id)
        res.render("member-home", {title : "Member Login Page"})
    },
    //Delete Account
    deleteaccount : function(req,res){
        var memberid = currloginUser
        console.log(memberid);
        dbController.dbController.deleteAccount(memberid)
        res.render("member-register", {title : "Member Login Page"})
    },
    //Delete one 
    
    deleteads : function(req,res){
        var selectedId = req.params.id
        dbController.dbController.deleteAds(selectedId)
        return res.redirect("/member/viewads")
        
    },
    //Update profile get
    updateprofile : function(req,res){
        var memberid =  currloginUser
        console.log(memberid);
       dbController.dbController.updateProfile(memberid,res)
        
    },

    //Update profile post
    updateProfilePost : function(req,res){
        var memberid = currloginUser
       // var email = currloginUser.email
       // emailController.send(email, "adpawar18@gmail.com", "Profile Update", "Dear Member, your profile is has been updated")
        dbController.dbController.updateProfileData(memberid,res,req)
        console.log("Profile Updated")
        //res.redirect("/member/viewads")
        res.render("member-home", {title : "Member Login Page"})

    },
    //Update password get
    updatepassword : function(req,res){
        res.render('member-update-password')
    },
    //Update password post
    updatePasswordPost : function(req,res){
        var id = currloginUser
        
        dbController.dbController.updatePasswordData(id,res,req)
        console.log("Password Updated")
        //res.redirect("/member/viewads")
        res.render("member-home", {title : "Member Login Page"})

    },
    /**********In View Ads */
    //Update content of ad get
    updatecontent : function(req,res){
        var id = req.params.id
        console.log(id + "con");
        dbController.dbController.updateContent(id,res)        
    },

    updateContentPost : function (req,res) { 
        var id = req.body.id
        var name = req.body.adname
        var description = req.body.addescription
        var price = req.body.adprice  
        dbController.dbController.updatecontentpost(name,req,res)
        console.log("Data Updated")
        res.redirect("/member/viewads")
    },
    reuploadImgView:function(req,res){
        var id = req.params.id 
        dbController.dbController.reuploadImgView(id,res)        
    },

    reuploadImg : async function (req,res) {
        var form = new formidable.IncomingForm()
        await dbController.reuploadImgAd(req,form,currloginUser)
        res.redirect("/member/viewads") 
    },
   

}
module.exports = controller