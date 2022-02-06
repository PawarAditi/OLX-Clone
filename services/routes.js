const controller = require("./controller")

module.exports = function(app1){

    app1.route("/").get(controller.home) 

    app1.route('/allads').get(controller.viewallads)

    app1.route('/viewFullDetails/:id').get(controller.viewFullDetails)

    app1.route('/contactMember/:id').get(controller.contactMember)

    app1.route('/sendMail').post(controller.sendMail)

   

}