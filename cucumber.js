const common = {
    requireModule: ['@playwright/test'],
    require: [
        'features/steps_definitions/*.js',
        'features/support/*.js'
    ],
    format: [
        '@cucumber/pretty-formatter',
        'json:cucumber-report.json'
    ],
    formatOptions: {
        snippetInterface: 'async-await'
    },
    timeout: 60000,  // 60 seconds timeout
    publishQuiet: true,
    worldParameters: {
        headless: false,
        slowMo: 50,
        timeout: 45000,
        viewport: {
            width: 1920,
            height: 1080
        }
    }
};

module.exports = {
    default: {
        ...common,
        format: [
            ...common.format
        ],
        parallel: 1,
        retry: 0
    },
    rerun: {
        ...common,
        format: [
            ...common.format
        ],
        parallel: 1,
        retry: 1
    }
};
