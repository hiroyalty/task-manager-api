const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (email, name) => {

    let welcomeMessage = {
        to: email, // Change to your recipient
        from: 'gbolaga.famodun@gmail.com', // Change to your verified sender
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me how you get along with the app.`,
        html: '<strong>Welcome to the new world of ease tasks. Let me how you get along with the app</strong>',
    }

    await sgMail.send(welcomeMessage)
}

const sendCancelationEmail = async (email, name) => {
    let cancelMessage = {
        to: email,
        from : 'gbolaga.famodun@gmail.com',
        subject: 'Sorry to see you go',
        text: `Dear ${name}, Goodbye, we hope to see you back soon, is there anything we could have done to keep you on board!. Thank you`
    }
    await sgMail.send(cancelMessage)
}
 
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}