/**
 * Contact form functionality for Roy Kimathi's Portfolio
 * Handles form submission and validation
 */

import { sendMessage } from './db.js';

document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const formMessage = document.getElementById('form-message');
    
    if (messageForm) {
        messageForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: formData.get('name').trim(),
                email: formData.get('email').trim(),
                subject: formData.get('subject').trim(),
                message: formData.get('message').trim()
            };
            
            // Validate form
            if (!validateForm(data)) {
                return;
            }
            
            // Disable submit button during processing
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Send message
            const result = await sendMessage(data);
            
            // Handle response
            if (result.success) {
                showFormMessage('Message sent successfully! I will get back to you soon.', 'success');
                messageForm.reset();
            } else {
                showFormMessage(result.error || 'Failed to send message. Please try again later.', 'error');
            }
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
    }
    
    /**
     * Validate contact form data
     * @param {Object} data - Form data
     * @returns {boolean} - True if valid, false otherwise
     */
    function validateForm(data) {
        // Check for empty fields
        if (!data.name || !data.email || !data.subject || !data.message) {
            showFormMessage('Please fill in all fields', 'error');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Show a message to the user
     * @param {string} message - Message to display
     * @param {string} type - 'success' or 'error'
     */
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = '';
        formMessage.classList.add(type);
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});