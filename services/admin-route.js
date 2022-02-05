const controller = require("./admin-controller")

module.exports = function(admin){

    admin.route('/').get(controller.login)

    admin.route("/login").get(controller.login)

    admin.route("/home").get(controller.home)

    admin.route("/loginverify").post(controller.loginverify)

    admin.route('/logout').get(controller.logout)

    admin.route('/viewMember').get(controller.viewMember)

    admin.route('/viewFull/:id').get(controller.viewFull)

    admin.route('/viewads').get(controller.viewads)

    admin.route('/requestMore/:id').get(controller.requestmore)

    admin.route('/requestmorePost').post(controller.requestmorepost)

    admin.route('/sendmail').get(controller.sendmail)


    

}

