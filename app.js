const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const querystring = require('querystring');


const Mail = require('./mail');


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

// Route to handle the subscriber information form submission
app.post('/handle-subscriber-survey', (req, res) => {
    const email = req.body.email;
    const computerExperience = req.body.computer_experience;
    const personalNetworkExperience = req.body.personal_network_experience;
    const interestAI = req.body.interest_ai;
    const interestBlockchain = req.body.interest_blockchain;
    const biggestITNeed = req.body.biggest_it_need;
    const lastITSupport = req.body.last_it_support;

    // Log form data (you can also save it to a database)
    console.log('Subscriber Information Form Data:');
    console.log('Email:', email);
    console.log('Computer Experience:', computerExperience);
    console.log('Personal Network Experience:', personalNetworkExperience);
    console.log('Interest in AI:', interestAI);
    console.log('Interest in Blockchain:', interestBlockchain);
    console.log('Biggest IT Need:', biggestITNeed);
    console.log('Last IT Support Provider:', lastITSupport);

    // Redirect to thank you page after submission
    res.redirect('/outreach/promotions');
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





// Route to handle the survey form submission
app.post('/handle-unsubscribe-survey', (req, res) => {

    /*

    Need to upload to database



    console.log('Survey Form Data:');
    console.log('Email:', req.body.email);
    console.log('Rating:', req.body.rating);
    console.log('Service Acquisition:', req.body.service_acquisition);
    console.log('Unsubscribe Reason:', req.body.unsubscribe_reason);
    console.log('Description:', req.body.description);

    */

    

    res.redirect('/thank-you');
});


// POST request handling for consultation form submission
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
