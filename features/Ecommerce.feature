Feature: Greeting

  Scenario: Placing the Order
    Given a login to an Ecommerce Application
    When the greeter says hello
    Then I should have heard "hello"