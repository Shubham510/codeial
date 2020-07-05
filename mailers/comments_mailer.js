const nodeMailer =  require('../config/nodemailer');

//THis is another way of exporting a method
exports.newComment = (comment) => {
    console.log('Inside newComment mailer',comment);

    nodeMailer.transporter.sendMail({
        from: 'heisenbergbing@gmail.com',
        to: 'shubham.bgp97@gmail.com',
        subject: "New Comment Published!",
        html: '<h1> Yup, your comment is now published!<h1>'
    }, (err, info) => {
        if(err){
            console.log("Error in sending mail", err);
            return;
        }
        console.log('Mail sent',info);
        return;
    });
}