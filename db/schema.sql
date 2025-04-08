-- Database: roy_kimathi_portfolio

CREATE DATABASE IF NOT EXISTS roy_kimathi_portfolio;
USE roy_kimathi_portfolio;

-- Users table for admin access (future expansion)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Visitor messages table
CREATE TABLE IF NOT EXISTS messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category ENUM('Technical', 'Management', 'Other') NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Skill reactions table
CREATE TABLE IF NOT EXISTS skill_reactions (
    reaction_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_id INT NOT NULL,
    reaction_type ENUM('like', 'love') NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    INDEX idx_skill_reaction (skill_id, reaction_type),
    INDEX idx_ip_skill (ip_address, skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Page views analytics
CREATE TABLE IF NOT EXISTS page_views (
    view_id INT AUTO_INCREMENT PRIMARY KEY,
    page_url VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_page_url (page_url),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial data for skills
INSERT INTO skills (skill_name, category, display_order) VALUES
('Operations Management', 'Technical', 1),
('Problem Solving and Incident Management', 'Technical', 2),
('Performance Monitoring', 'Technical', 3),
('IT Compliance', 'Technical', 4),
('Budget and Cost management', 'Management', 1),
('IT Risk Management and Disaster Recovery planning', 'Technical', 5),
('IT Infrastructure Management', 'Technical', 6),
('ITIL Framework', 'Technical', 7),
('Data Center Management', 'Technical', 8),
('IT Asset Management', 'Technical', 9),
('Team Leadership', 'Management', 2),
('Project Management', 'Management', 3),
('Project Tracking and Reporting', 'Management', 4);