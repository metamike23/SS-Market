



-- Create the email_list table with all required columns
CREATE TABLE email_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    engagement VARCHAR(100),
    frequency VARCHAR(50),
    restrictions VARCHAR(255)
);





CREATE TABLE subscribe_survey (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_id INT NOT NULL,
    computer_experience ENUM(
        'beginner',
        'intermediate',
        'advanced'
    ) NOT NULL,
    personal_network_experience ENUM('yes', 'no') NOT NULL,
    interest_ai ENUM('yes', 'no') NOT NULL,
    interest_blockchain ENUM('yes', 'no') NOT NULL,
    biggest_it_need TEXT,
    last_it_support VARCHAR(255),
    FOREIGN KEY (email_id) REFERENCES email_list(id) ON DELETE CASCADE
);





CREATE TABLE unsubscribe_survey(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_id INT NOT NULL,
    unsubscribe_reason ENUM(
        'never_signed_up',
        'too_frequent',
        'irrelevant_content',
        'not_interested',
        'prefer_text',
        'other'
    ) NOT NULL,
    description TEXT,
    service_acquisition ENUM(
        'family_friend',
        'internet_search',
        'have_technician',
        'job_finder',
        'unsure',
        'other'
    ) NOT NULL,
    FOREIGN KEY(email_id) REFERENCES email_list(id) ON DELETE CASCADE
);