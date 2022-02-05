const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

var sendMail = {
    send : function(toEmail, fromEmail,subject,html){
        //data verification
        //mandatory data
        if( toEmail == null )
        {
            return null;
        }
        const msg = {
            to: toEmail,
            from: fromEmail,
            subject: subject,
            html: html,
            
          }

          sgMail
            .send(msg)
            .then(() => {
            console.log('Email sent')
            })
            .catch((error) => {
            console.error(error)
            })
    },
    sendwithoutcc: function(toEmail,fromEmail,subject, html){
        //data verification
        //mandatory data
        if( toEmail == null )
        {
            return null;
        }

        const msg = {
            to: toEmail,
            from: fromEmail,            
            subject: subject,
            html: html
            
          }

          sgMail
            .send(msg)
            .then(() => {
            console.log('Email sent')
            })
            .catch((error) => {
            console.error(error)
            })
    }
}

module.exports = sendMail