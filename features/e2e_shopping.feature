@shopping
Feature: E2E Shopping Flow
  As a new customer
  I want to register, login, and complete a purchase
  So that I can buy products from the e-commerce site

  @regression
  Scenario Outline: Complete shopping flow with different products
    Given I am on the login page
    When I navigate to the registration page
    And I register as a new user
    And I login with the registered credentials
    Then I should be on the products page
    When I add "<product>" to the cart
    And I navigate to the cart
    Then the product "<product>" should be in the cart
    When I proceed to checkout
    And I enter shipping details for a random country
    And I place the order
    Then I should see the order confirmation
    And I should capture the order confirmation screenshot

    Examples:
      | product         |
      | ADIDAS ORIGINAL |
      | ZARA COAT 3    |

  @smoke
  Scenario: Quick purchase with random product
    Given I am on the login page
    When I navigate to the registration page
    And I register with the following details:
      | firstName | lastName | email                      | phone      | occupation | password | confirmPassword |
      | John      | Doe      | john.doe{timestamp}@test.com | 1234567890 | Student    | Test@123 | Test@123       |
    And I login with the registered credentials
    Then I should be on the products page
    When I add "ADIDAS ORIGINAL" to the cart
    And I navigate to the cart
    Then the product "ADIDAS ORIGINAL" should be in the cart
    When I proceed to checkout
    And I enter shipping information for "ind"
    And I place the order
    Then I should see the order confirmation
    And I should capture the order confirmation screenshot
