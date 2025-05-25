const environments = {
    qa: {
        baseUrl: 'https://rahulshettyacademy.com/client/',
        apiUrl: 'https://rahulshettyacademy.com/api/ecom/',
        defaultUser: {
            email: 'test@example.com',
            password: 'Test@123'
        }
    },
    staging: {
        baseUrl: 'https://staging.rahulshettyacademy.com/client/',
        apiUrl: 'https://staging.rahulshettyacademy.com/api/ecom/',
        defaultUser: {
            email: 'staging@example.com',
            password: 'Test@123'
        }
    }
};

function getConfig() {
    const env = process.env.TEST_ENV || 'qa';
    return environments[env];
}

module.exports = {
    config: getConfig(),
    environments
};
