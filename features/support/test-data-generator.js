const faker = require('@faker-js/faker').faker;

class TestDataGenerator {
    generateUserData() {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.number('##########'),
            occupation: faker.helpers.arrayElement(['Student', 'Engineer', 'Doctor', 'Teacher']),
            password: 'Test@123',
            confirmPassword: 'Test@123'
        };
    }

    generateProductData() {
        return {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            category: faker.commerce.department()
        };
    }

    generateShippingData() {
        return {
            country: faker.location.country(),
            countryCode: faker.location.countryCode().toLowerCase(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode()
        };
    }

    generatePaymentData() {
        return {
            cardNumber: faker.finance.creditCardNumber(),
            cardHolder: faker.person.fullName(),
            expiryDate: faker.date.future().toLocaleDateString(),
            cvv: faker.finance.creditCardCVV()
        };
    }
}

module.exports = new TestDataGenerator();
