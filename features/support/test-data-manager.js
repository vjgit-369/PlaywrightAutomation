const fs = require('fs').promises;
const path = require('path');
const testDataGenerator = require('./test-data-generator');

class TestDataManager {
    constructor() {
        this.dataPath = path.join(process.cwd(), 'test-data');
        this.testData = new Map();
        this.scenariosData = null;
    }

    async loadTestScenarios() {
        if (this.scenariosData) return this.scenariosData;
        
        try {
            const data = await fs.readFile(path.join(this.dataPath, 'test-scenarios.json'), 'utf8');
            this.scenariosData = JSON.parse(data);
            return this.scenariosData;
        } catch (error) {
            console.error('Error loading test scenarios:', error);
            return null;
        }
    }

    async generateUserData(tags = []) {
        const userData = testDataGenerator.generateUserData();
        if (tags.length > 0) {
            this.testData.set(tags[0], { ...userData, timestamp: Date.now() });
        }
        return userData;
    }

    async getProductData(productName) {
        const scenarios = await this.loadTestScenarios();
        return scenarios?.products?.find(p => p.name === productName) || null;
    }

    async saveTestData(scenarioName, data) {
        await fs.mkdir(this.dataPath, { recursive: true });
        const filePath = path.join(this.dataPath, `${scenarioName}.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    async loadTestData(scenarioName) {
        const filePath = path.join(this.dataPath, `${scenarioName}.json`);
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    getScenarioData(tag) {
        return this.testData.get(tag) || null;
    }
}

module.exports = new TestDataManager();
