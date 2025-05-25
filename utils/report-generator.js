const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'bootstrap',
    jsonFile: 'cucumber-report.json',
    output: 'cucumber-report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    metadata: {
        'App Version': '1.0.0',
        'Test Environment': 'QA',
        Browser: 'Chrome',
        Platform: 'Windows'
    }
};

reporter.generate(options);
