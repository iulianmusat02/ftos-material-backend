const sendEmail = (arg) => {
    console.log('sending email')
    const nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport({
        service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
        auth: {
            user: 'contactrewearoo@gmail.com',
            pass: 'uilbuslnwchncssn'
        }
    });
    
    var mailOptions = {
        from: 'contactrewearoo@gmail.com',
        to: arg.to,
        subject: arg.subject,
        text: arg.body
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else { 
        console.log('Email sent: ' + info.response);
        }
    })
}


module.exports = {sendEmail};
