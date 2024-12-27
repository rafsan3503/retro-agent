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