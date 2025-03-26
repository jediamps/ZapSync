CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Files (
    file_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    storage_url TEXT NOT NULL,
    encryption_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AccessControl (
    access_id SERIAL PRIMARY KEY,
    file_id INT REFERENCES Files(file_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    access_type ENUM('view', 'edit', 'owner') NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DLP_Flags (
    dlp_id SERIAL PRIMARY KEY,
    file_id INT REFERENCES Files(file_id) ON DELETE CASCADE,
    detected_data TEXT NOT NULL,
    severity ENUM('low', 'medium', 'high') NOT NULL,
    flagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ActivityLogs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


