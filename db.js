// db.js

const mysql = require('mysql2/promise');  // Require mysql2/promise for promises-based API
require('dotenv').config();

// Create a pool of connections
const pool = mysql.createPool({
    host: process.env.DB_HOST,  // Replace with your MySQL host
    user: process.env.DB_USER,  // Replace with your MySQL username
    password: process.env.DB_PASS,  // Replace with your MySQL password
    database: process.env.DB_NAME,  // Replace with your MySQL database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

class Database {
    // Static method to insert a new record into email_list table
    static async addEmailRecord(name, email, phone, address, engagement) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO email_list (name, email, phone, address, engagement) VALUES (?, ?, ?, ?, ?)',
                [name, email, phone, address, engagement]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Static method to get email ID by email
    static async getEmailIdByEmail(email) {
        try {
            const [emailResult] = await pool.execute(
                'SELECT id FROM email_list WHERE email = ?',
                [email]
            );
            return emailResult;
        } catch (error) {
            throw error;
        }
    }

    // Static method to update the users engagement, frequency, and restrictions based on email
    static async updateEmailRecordByEmail(email, engagement, frequency, restrictions) {
        try {
            const [result] = await pool.execute(
                'UPDATE email_list SET engagement = ?, frequency = ?, restrictions = ? WHERE email = ?',
                [engagement, frequency, restrictions, email]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Static method to insert a new survey result into subscribe_survey table
    static async addSurveyResult(emailId, computerExperience, personalNetworkExperience, interestAI, interestBlockchain, biggestITNeed, lastITSupport) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO subscribe_survey (email_id, computer_experience, personal_network_experience, interest_ai, interest_blockchain, biggest_it_need, last_it_support) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [emailId, computerExperience, personalNetworkExperience, interestAI, interestBlockchain, biggestITNeed, lastITSupport]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }


    // Static method to insert a new unsubscribe survey result into unsubscribe_survey table
    static async addUnsubscribeSurveyResult(emailId, unsubscribeReason, description, serviceAcquisition) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO unsubscribe_survey (email_id, unsubscribe_reason, description, service_acquisition) VALUES (?, ?, ?, ?)',
                [emailId, unsubscribeReason, description, serviceAcquisition]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = {
    Database,
    pool
};
