/**
 * Node.js server for Roy Kimathi's Portfolio
 * Handles API endpoints and database interactions
 */

const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConfig = require('./db-config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost', 'http://127.0.0.1', 'https://roykimathi.com'] // Update with your domain
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool
const pool = mysql.createPool(dbConfig);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString() 
    });
});

// API Endpoints

/**
 * Save message from contact form
 */
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }
        
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent') || '';
        
        const [result] = await pool.execute(
            'INSERT INTO messages (name, email, subject, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, subject, message, ip, userAgent]
        );
        
        res.status(201).json({ 
            success: true, 
            messageId: result.insertId 
        });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to save message' 
        });
    }
});

/**
 * Get skill reactions counts
 */
app.get('/api/skills/reactions', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.skill_id, s.skill_name, 
                   SUM(CASE WHEN sr.reaction_type = 'like' THEN 1 ELSE 0 END) AS like_count,
                   SUM(CASE WHEN sr.reaction_type = 'love' THEN 1 ELSE 0 END) AS love_count
            FROM skills s
            LEFT JOIN skill_reactions sr ON s.skill_id = sr.skill_id
            GROUP BY s.skill_id, s.skill_name
            ORDER BY s.display_order
        `);
        
        res.json({ 
            success: true, 
            skills: rows 
        });
    } catch (error) {
        console.error('Error fetching skill reactions:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch skill reactions' 
        });
    }
});

/**
 * Add skill reaction
 */
app.post('/api/skills/:id/reactions', async (req, res) => {
    try {
        const skillId = req.params.id;
        const { reactionType } = req.body;
        
        if (!['like', 'love'].includes(reactionType)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid reaction type' 
            });
        }
        
        const ip = req.ip || req.connection.remoteAddress;
        
        // Check if this IP already reacted to this skill
        const [existing] = await pool.execute(
            'SELECT 1 FROM skill_reactions WHERE skill_id = ? AND ip_address = ? AND reaction_type = ?',
            [skillId, ip, reactionType]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Already reacted' 
            });
        }
        
        // Insert new reaction
        await pool.execute(
            'INSERT INTO skill_reactions (skill_id, reaction_type, ip_address, user_agent) VALUES (?, ?, ?, ?)',
            [skillId, reactionType, ip, req.get('User-Agent') || '']
        );
        
        // Get updated counts
        const [result] = await pool.query(`
            SELECT 
                SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) AS like_count,
                SUM(CASE WHEN reaction_type = 'love' THEN 1 ELSE 0 END) AS love_count
            FROM skill_reactions
            WHERE skill_id = ?
        `, [skillId]);
        
        res.json({ 
            success: true, 
            counts: {
                like: result[0].like_count || 0,
                love: result[0].love_count || 0
            }
        });
    } catch (error) {
        console.error('Error adding skill reaction:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to add reaction' 
        });
    }
});

/**
 * Track page view
 */
app.post('/api/analytics/pageview', async (req, res) => {
    try {
        const { pageUrl, referrer } = req.body;
        
        if (!pageUrl) {
            return res.status(400).json({ 
                success: false, 
                error: 'Page URL is required' 
            });
        }
        
        const ip = req.ip || req.connection.remoteAddress;
        
        await pool.execute(
            'INSERT INTO page_views (page_url, ip_address, user_agent, referrer) VALUES (?, ?, ?, ?)',
            [pageUrl, ip, req.get('User-Agent') || '', referrer || '']
        );
        
        res.json({ 
            success: true 
        });
    } catch (error) {
        console.error('Error tracking page view:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to track page view' 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});