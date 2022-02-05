const dbController = require("./admin-db")

const emailController = require("./mail-service")


//mController.dbController.connection()
dbController.dbController.connection()
var currloginUser;
var controller = {
    home : function(req,res){
        
            res.render("admin-home" , {title : "Member home page" , userData: currloginUser})
        
    },
    login : function(req,res){
        res.render("admin-login" ,{title : "Member Login page" })
    },
    loginverify : async function(req, res){
        var email = req.body.email
        var password = req.body.password
        console.log("Email : ", email)
        console.log("Password : ", password)
        var userData = await dbController.loginUser(email, password)
       // console.log("userData : ", userData)
        loginUser = userData
        currloginUser = userData
        if (userData != null)
        {
            res.render("admin-home", {title : "Admin Home Page", data : userData})
        }
        else
        {
            res.render("admin-login", {title : "Amin Login Page"})
        }
    },
    logout : function(req,res){
        req.session.destroy(function(err){
            console.log("Session destroy");
        })
        res.render("admin-login", {title : "Admin Login Page"})
    },
    viewMember : function(req,res){
        dbController.dbController.viewMembers(res)
    },
    viewFull : function(req,res,id){
        var id = req.params.id
        dbController.dbController.viewFullData(res,id)
    },
    viewads : function(req,res){
        var id = req.params.id
        dbController.dbController.viewAds(id,res)
    },//sleep
    requestmore: function(req,res){
        var id = req.params.id
        dbController.dbController.requestmore(id, res)
    }, 
    requestmorepost : function (req, res) {
        var memberData = {            
            memberid: req.body.memberid,
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        }
        var adData = {
            _id: req.body.id,
            name:req.body.name
        }
        mailBody = "Hi member"+memberData.name+", " + "<br><p> Admin has requested on your product <b>"+ "</p></br><p>Request : <b>" + memberData.message + "</b</p>"
        emailController.sendwithoutcc(memberData.email, "adpawar18@gmail.com", "Message Request", mailBody)
        res.redirect("/admin/viewads")
    },
    sendmail : async function (req,res) {
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
}

module.exports = controller