Feature: User Registration
  As a new user
  I want to register on the application
  So that I can access the shopping features

  Scenario: Register with valid details
    Given I am on the registration page
    When I fill in the registration form with valid details
    And I select occupation as Student
    And I fill in matching passwords
    And I check the age checkbox
    And I submit the registration form
    Then I should see the successful registration message

  Scenario: Login and verify products display
    Given I am on the login page
    When I enter valid credentials
    And I click login
    Then I should see the products page
    And I should see all products displayed
    And I should see the correct page title
