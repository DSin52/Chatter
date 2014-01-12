var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport("SMTP",{
    service: 'Gmail',
    auth: {
        user: 'noderunner52@gmail.com',
        pass: '********'
    }
});

function sendEmail(emailAddress, text)
{
    var mailOptions = {
        from: 'D S <noderunner52@gmail.com>',
        to: emailAddress,
        text: text,
        subject: 'Password Retrieval'
    };
    var checkString = /.*[@]+.*[.com]+/;
    var result = checkString.test(emailAddress);
    if (result)
        {
            transport.sendMail(mailOptions, function(error, response) {
                if (error)
                    {
                        console.log(error);
                    }
                    else
                        {
                            console.log('Message sent: ' + response.message);
                        }
            });
        }
        else{
            console.log('There is not account with that username'); 
        }
}
exports.sendEmail = sendEmail;