const controller = require("./member-controller")

module.exports = function(member){

    member.route("/").get(controller.login)

    member.route("/login").get(controller.login)

    member.route("/loginverify").post(controller.loginverify)

    member.route('/register').get(controller.register)

    member.route("/addMember").post(controller.addmember) //after register

    member.route('/logout').get(controller.logout)

    member.route('/forgot').get(controller.forgotView)

    member.route('/sendpassword').post(controller.sendPassword)

    /*****************************************/

    member.route('/memberhome').get(controller.home)

    member.route('/addAd').get(controller.addAd)

    member.route('/addAdpost').post(controller.addAdpost)

    member.route('/viewads').get(controller.viewads)

    member.route('/deleteall').get(controller.deleteall)

    member.route('/deleteaccount').get(controller.deleteaccount)

    member.route('/updateprofile').get(controller.updateprofile)

    member.route('/updateprofilepost').post(controller.updateProfilePost)

    member.route('/updatepassword').get(controller.updatepassword)

    member.route('/updatepasswordpost').post(controller.updatePasswordPost)

    /***********In View all ads***********/

    member.route('/updatecontent/:id').get(controller.updatecontent)

    member.route('/updatecontentpost').post(controller.updateContentPost)

    member.route("/reuploadImg/:id").get(controller.reuploadImgView)

    member.route("/reuploadImg").post(controller.reuploadImg)

    member.route('/deletead/:id').get(controller.deleteads)

    
}