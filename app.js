const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const querystring = require('querystring');


const Mail = require('./mail');
const { Database } = require('./db');  

const app = express();
const port = 3000;



const base64Encode = (str) => Buffer.from(str).toString('base64');
const base64Decode = (str) => Buffer.from(str, 'base64').toString('utf-8');

app.set('view engine', 'html'); // Set View engine to html for the Express app
app.use(express.static('public')) // Use public folder to hold static web resources


// Middleware to parse JSON and urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/outreach/public/css', (req, res, next) => {
    res.setHeader('Content-Type', 'text/css');
    next();
  });




// Route to serve the subscribe.html
app.get('/outreach/subscribe', (req, res) => {
    console.log(__dirname)
    res.sendFile(__dirname + '/public/subscriber.html')
})


// Route to serve the subscribe.html
app.get('/outreach/promotions/consultation', (req, res) => {
    console.log(__dirname)
    res.sendFile(__dirname + '/public/promo-consultation.html')
})

// Route to serve the unsubscribe.html
app.get('/outreach/unsubscribe', (req, res) => {
    console.log(__dirname)
    res.sendFile(__dirname + '/public/unsubscribe.html')
})

// Route to serve the unsubscribe.html
app.get('/outreach/promotions', (req, res) => {
    console.log(__dirname)
    res.sendFile(__dirname + '/public/special-offer-0624.html')
})

// Route to thank you page
app.get('/thank-you', (req, res) => {
    res.sendFile(__dirname + '/public/thank-you.html', (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});

// Route to render the unsubscribe-survey page
app.get('/unsubscribe-survey', (req, res) => {
    const encodedQuery = req.query.q;
    const decodedQuery = base64Decode(encodedQuery);
    const query = querystring.parse(decodedQuery);
    const email = query.email;
    console.log('Decoded email:', email);
    res.sendFile(__dirname + '/public/unsubscribe-survey.html', (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});



// Route to render the subscribe-survey page
app.get('/subscribe-survey', (req, res) => {
    const encodedQuery = req.query.q;
    const decodedQuery = base64Decode(encodedQuery);
    const query = querystring.parse(decodedQuery);
    const email = query.email;
    console.log('Decoded email:', email);
    res.sendFile(__dirname + '/public/subscribe-survey.html', (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});






// Route to handle subscribe form submission
app.post('/subscribe', (req, res) => {
    // Print the checkbox values and email to the console
    console.log('Checkbox values:');
    console.log('Sponsored Promotional Discounts:', req.body.optInPromotionalDiscounts === 'on');
    console.log('Remote IT Consultation:', req.body.optInRemoteConsultation === 'on');
    console.log('Email:', req.body.email);

    const email = req.body.email;
    const query = querystring.stringify({ email });
    const encodedQuery = base64Encode(query);
        

    // Redirect to the survey with the email as a query parameter
    res.redirect(`/subscribe-survey?q=${encodeURIComponent(encodedQuery)}`);
});





/*
    Route to handle the subscriber information form submission
    - 1) Get form data
    - 2) Get user email from email_list table
    - 3) Add survey info to subscribe_survey table
    - 4) Route user to promotions page

    *
*/
app.post('/handle-subscriber-survey', async (req, res) => {
    // get from values for request body
    const email = req.body.email;
    const computerExperience = req.body.computer_experience;
    const personalNetworkExperience = req.body.personal_network_experience;
    const interestAI = req.body.interest_ai;
    const interestBlockchain = req.body.interest_blockchain;
    const biggestITNeed = req.body.biggest_it_need;
    const lastITSupport = req.body.last_it_support;

    // send survey info to database
    try {
        // Use method to get the email ID
        const emailResult = await Database.getEmailIdByEmail(email);
        if (emailResult.length === 0) {
            return res.status(400).json({ error: 'Email not found in email_list' });
        }

        const emailId = emailResult[0].id;

        // Add survey result
        const surveyResult = await Database.addSurveyResult(
            emailId,
            computerExperience,
            personalNetworkExperience,
            interestAI,
            interestBlockchain,
            biggestITNeed,
            lastITSupport
        );

        console.log('Added survey result:', surveyResult);

        // Redirect to thank you page after submission
        res.redirect('/outreach/promotions');
    } catch (error) {
        console.error('Database operation error:', error);
        res.status(500).json({ error: 'Failed to add survey result' });
    }
});








// Route to handle unsubscribe form submission
app.post('/unsubscribe', (req, res) => {
    /*

    Print the form data to the console

        console.log('Unsubscribe Form Data:');
        console.log('Seasonal Offers:', req.body.optSeasonalOffers === 'on');
        console.log('Twice a Month:', req.body.optTwiceMonth === 'on');
        console.log('Once a Month:', req.body.optOnceMonth === 'on');
        console.log('Unsubscribe All:', req.body.unsubscribeAll === 'on');
        console.log('Email:', req.body.email);
    */
    

    const email = req.body.email;
    const query = querystring.stringify({ email });
    const encodedQuery = base64Encode(query);
        

    // Redirect to the survey with the email as a query parameter
    res.redirect(`/unsubscribe-survey?q=${encodeURIComponent(encodedQuery)}`);
});






/*
    Route to handle the unsubscriber information form submission
    - 1) Get form data
    - 2) Get user email from email_list table
    - 3) Add survey info to unsubscribe_survey table
    - 4) Route user to thank-you page

    *
*/
app.post('/handle-unsubscribe-survey', async (req, res) => {
    const email = req.body.email;
    const unsubscribeReason = req.body.unsubscribe_reason;
    const description = req.body.description;
    const serviceAcquisition = req.body.service_acquisition;


    try {
        // Use the new static method to get the email ID
        const emailResult = await Database.getEmailIdByEmail(email);
        if (emailResult.length === 0) {
            return res.status(400).json({ error: 'Email not found in email_list' });
        }

        const emailId = emailResult[0].id;

        // Add unsubscribe survey result
        const surveyResult = await Database.addUnsubscribeSurveyResult(
            emailId,
            unsubscribeReason,
            description,
            serviceAcquisition
        );

        console.log('Added unsubscribe survey result:', surveyResult);

        // Redirect to thank you page after submission
        res.redirect('/thank-you');
    } catch (error) {
        console.error('Database operation error:', error);
        res.status(500).json({ error: 'Failed to add unsubscribe survey result' });
    }
});





/*
    POST request handling for consultation form submission
    - 1) Get form data
    - 2) Get user email from email_list table
    ....

    *
*/
app.post('/book-consultation', async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const service_needed = req.body.service_needed
    const phone = req.body.phone
    const consultation_type = req.body.consultation_type
    const duration = '20 Minutes'

    // Simulate failure if email is restricted
    if (email === 'banned@gmail.com') {
        return res.status(400).json({ error: 'Offer already redeemed for this email address.' });
    }

    try {
        // Assuming Mail.sendVerificationEmail is an async function
        await Mail.sendVerificationEmail(email, 'Consultation Verified', name, service_needed, consultation_type, duration);

        res.status(200).json({ message: 'Verification email sent successfully.' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ error: 'Failed to send verification email.' });
    }
});






app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});






app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
