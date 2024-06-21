// mail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

class Mail {


    static async sendVerificationEmail(to, subject, name) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: Mail.generateVerificationEmailBody(name) // Call the HTML generator function here
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.error('Error sending email: ' + error);
        }
    }


    static generateVerificationEmailBody(name) {
        return `
            <html>
            <head>
                <style>
                    /* Define your CSS styles here */
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        background-color: #b3e0ff;
                        color: white;
                        text-align: center;
                        padding: 10px;
                        font-size: 24px;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Verification Email</h2>
                    </div>
                    <div class="content">
                        <p>Hello ${name},</p>
                        <p>Thank you for choosing our IT Consultation service. Please click the link below to schedule your remote consultation:</p>
                        <p><a href="https://example.com/verify">Schedule Consultation</a></p>
                        <p>If you have any questions or need further assistance, please feel free to contact us.</p>
                    </div>
                    <div class="footer">
                        <p>Best regards,<br>Scalable Solutions Team</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    
}




module.exports = Mail;



