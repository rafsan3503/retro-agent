// Define a global variable to store environment variables
window.ENV = window.ENV || {
    OPENROUTER_API_KEY: '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'
};

const CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    OPENROUTER_API_KEY: window.ENV.OPENROUTER_API_KEY,
    DEFAULT_MODEL: 'mistralai/mistral-7b-instruct',  // Changed to a valid model
    SIMULATION_SPEED: {
        HOUR_DURATION: 300000, // 5 minutes in milliseconds
        MESSAGE_DELAY: 20000,  // 20 seconds between messages
        TYPING_DELAY: 2000     // 2 seconds for typing indicator
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;  // Make CONFIG available globally in browser
} 