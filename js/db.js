/**
 * Database interaction functions for Roy Kimathi's Portfolio
 * Handles all communication with the backend API
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Send a message from the contact form
 * @param {Object} messageData - Contains name, email, subject, message
 * @returns {Promise<Object>} - Response from server
 */
async function sendMessage(messageData) {
    try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error sending message:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to send message' 
        };
    }
}

/**
 * Get skill reactions counts from server
 * @returns {Promise<Object>} - Contains array of skills with reaction counts
 */
async function getSkillReactions() {
    try {
        const response = await fetch(`${API_BASE_URL}/skills/reactions`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching skill reactions:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to fetch skill reactions' 
        };
    }
}

/**
 * Add a reaction to a skill
 * @param {string} skillId - ID of the skill
 * @param {string} reactionType - 'like' or 'love'
 * @returns {Promise<Object>} - Contains updated reaction counts
 */
async function addSkillReaction(skillId, reactionType) {
    try {
        const response = await fetch(`${API_BASE_URL}/skills/${skillId}/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reactionType })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error adding skill reaction:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to add reaction' 
        };
    }
}

/**
 * Track a page view for analytics
 * @param {string} pageUrl - URL of the page viewed
 * @param {string} referrer - Referring URL
 * @returns {Promise<Object>} - Success status
 */
async function trackPageView(pageUrl, referrer) {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/pageview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pageUrl, referrer })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error tracking page view:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to track page view' 
        };
    }
}

export { sendMessage, getSkillReactions, addSkillReaction, trackPageView };