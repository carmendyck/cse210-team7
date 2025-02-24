/// <reference types="cypress" />

describe("Signup Page Tests", () => {
 beforeEach(() => {
   cy.clearLocalStorage();
   cy.visit("http://localhost:8100/signup");
   cy.get('.signup-container').should('be.visible');
 });

 it("the page should display the signup form correctly", () => {
   cy.get("h1").should("contain", "Sign Up");
   cy.get(".welcome-text").should("contain", "Create an account to continue");
   cy.get('ion-input[placeholder="Full Name"]').should("exist");
   cy.get('ion-input[placeholder="Email"]').should("exist");
   cy.get('ion-input[placeholder="Password"]').should("exist");
   cy.get('ion-input[placeholder="Confirm Password"]').should("exist");
   cy.get('.signup-button').should("exist");
   cy.get('.login-text').should("contain", "Already have an account? Log in");
 });

 it("it should show error message for empty fields", () => {
   cy.get('.signup-button').click();
   cy.get(".error-message").should("contain", "Full name is required");
 });

 it("should validate email format", () => {
   cy.get('ion-input[placeholder="Full Name"]').type("Test User");
   cy.get('ion-input[placeholder="Email"]').type("invalid-email");
   cy.get('.signup-button').click();
   cy.get(".error-message").should("contain", "Invalid email format");
 });

 it("it should validate password length", () => {
   cy.get('ion-input[placeholder="Full Name"]').type("Ramdom User");
   cy.get('ion-input[placeholder="Email"]').type("test@example.com");
   cy.get('ion-input[placeholder="Password"]').type("12345");
   cy.get('.signup-button').click();
   cy.get(".error-message").should("contain", "Password must be at least 6 characters");
 });

 it("should validate password match", () => {
   cy.get('ion-input[placeholder="Full Name"]').type("Random User");
   cy.get('ion-input[placeholder="Email"]').type("test@example.com");
   cy.get('ion-input[placeholder="Password"]').type("random");
   cy.get('ion-input[placeholder="Confirm Password"]').type("randomahha");
   cy.get('.signup-button').click();
   cy.get(".error-message").should("contain", "Passwords don't match");
 });

 it("should handle existing email error", () => {
   cy.intercept("POST", "http://localhost:5050/api/auth/signup", {
     statusCode: 400,
     body: { error: "EMAIL_EXISTS" }
   }).as("signupAttempt");

   cy.get('ion-input[placeholder="Full Name"]').type("Test User");
   cy.get('ion-input[placeholder="Email"]').type("test-signup@gmail.com.com");
   cy.get('ion-input[placeholder="Password"]').type("qwerty@123");
   cy.get('ion-input[placeholder="Confirm Password"]').type("qwerty@123");
   cy.get('.signup-button').click();

   cy.wait("@signupAttempt");
   cy.get(".error-message").should("contain", "This email is already registered");
 });

 it("should handle successful signup", () => {
   cy.intercept("POST", "http://localhost:5050/api/auth/signup", {
     statusCode: 201,
     body: { token: "fake-jwt-token" }
   }).as("signupAttempt");

   cy.get('ion-input[placeholder="Full Name"]').type("Test User");
   cy.get('ion-input[placeholder="Email"]').type("newuser@example.com");
   cy.get('ion-input[placeholder="Password"]').type("123456");
   cy.get('ion-input[placeholder="Confirm Password"]').type("123456");
   cy.get('.signup-button').click();

   cy.wait("@signupAttempt");
   cy.get(".success-animation").should("exist");
   cy.get(".success-text").should("contain", "Welcome aboard!");
   cy.url().should("include", "/create_acct_pref");
 });

 it("should navigate to login page", () => {
   cy.get('.login-text').click();
   cy.url().should("include", "/login");
 });

 it("should handle network errors", () => {
   cy.intercept("POST", "http://localhost:5050/api/auth/signup", {
    // this add like a network error to see if error handling
     forceNetworkError: true
   }).as("signupAttempt");

   cy.get('ion-input[placeholder="Full Name"]').type("Test User");
   cy.get('ion-input[placeholder="Email"]').type("test@example.com");
   cy.get('ion-input[placeholder="Password"]').type("123456");
   cy.get('ion-input[placeholder="Confirm Password"]').type("123456");
   cy.get('.signup-button').click();

   cy.get(".error-message").should("contain", "Error creating account");
 });

 it("this should clear error message when typing", () => {
   cy.get('.signup-button').click();
   cy.get(".error-message").should("exist");
   cy.get('ion-input[placeholder="Full Name"]').type("a");
   cy.get(".error-message").should("not.exist");
 });

 it("this test checks if it shows loading state during signup", () => {
   cy.intercept("POST", "http://localhost:5050/api/auth/signup", {
     delay: 1000,
     statusCode: 201,
     body: { token: "fake-jwt-token" }
   }).as("signupAttempt");

   cy.get('ion-input[placeholder="Full Name"]').type("Test User");
   cy.get('ion-input[placeholder="Email"]').type("test@example.com");
   cy.get('ion-input[placeholder="Password"]').type("123456");
   cy.get('ion-input[placeholder="Confirm Password"]').type("123456");
   cy.get('.signup-button').click();

   cy.get('.signup-button').should("contain", "Creating Account...");
 });
});