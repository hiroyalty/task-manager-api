const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gbolaga.famodun@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from : 'gbolaga.famodun@gmail.com',
        subject: 'Sorry to see you go',
        text: `Dear ${name}, Goodbye, we hope to see you back soon, is there anything we could have done to keep you on board!. Thank you`
    })
}
 
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}