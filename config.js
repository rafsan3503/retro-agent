const CONFIG = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    OPENROUTER_API_KEY: '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',
    DEFAULT_MODEL: 'mistralai/mistral-7b-instruct',  // Changed to a valid model
    SIMULATION_SPEED: {
        HOUR_DURATION: 300000, // 5 minutes in milliseconds
        MESSAGE_DELAY: 20000,  // 20 seconds between messages
        TYPING_DELAY: 2000     // 2 seconds for typing indicator
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 