/// <reference types="cypress" />

describe("Login Page Tests", () => {
 beforeEach(() => {
   cy.clearLocalStorage();
   cy.visit("http://localhost:8100/login");
   cy.get('.login-container').should('be.visible');
 });

 it("should display the login form correctly", () => {
   cy.get("h1").should("contain", "Login");
   cy.get(".welcome-text").should("contain", "Welcome back! Please log in.");
   cy.get('ion-input[placeholder="Email"]').should("exist");
   cy.get('ion-input[placeholder="Password"]').should("exist");
   cy.get('.signin-button').should("exist");
   cy.get('.create-account-button').should("exist");
   cy.get('.forgot-password').should("contain", "Forgot your password?");
 });

 it("should show error message for empty fields", () => {
   cy.get('.signin-button').click();
   cy.get(".error-message").should("contain", "Please enter both email and password");
 });

 it("should handle invalid password", () => {
   cy.intercept("POST", "http://localhost:5050/api/auth/login", {
     statusCode: 401,
     body: { error: "INVALID_PASSWORD" }
   }).as("loginAttempt");

   cy.get('ion-input[placeholder="Email"]').type("test@example.com");
   cy.get('ion-input[placeholder="Password"]').type("wrongpassword");
   cy.get('.signin-button').click();

   cy.wait("@loginAttempt");
   cy.get(".error-message").should("contain", "Invalid password, please try again");
 });

 it("should handle non-existent account", () => {
   cy.intercept("POST", "http://localhost:5050/api/auth/login", {
     statusCode: 404,
     body: { error: "NO_ACCOUNT_EXISTS" }
   }).as("loginAttempt");

   cy.get('ion-input[placeholder="Email"]').type("nonexistent@example.com");
   cy.get('ion-input[placeholder="Password"]').type("password123");
   cy.get('.signin-button').click();

   cy.wait("@loginAttempt");
   cy.get(".error-message").should("contain", "No account exists with this email");
 });

 it("should handle successful login", () => {
   cy.intercept("POST", "http://localhost:5050/api/auth/login", {
     statusCode: 200,
     body: { token: "fake-jwt-token" }
   }).as("loginAttempt");

   cy.get('ion-input[placeholder="Email"]').type("valid@example.com");
   cy.get('ion-input[placeholder="Password"]').type("validpassword");
   cy.get('.signin-button').click();

   cy.wait("@loginAttempt");
   cy.url().should("include", "/tasklist");
 });

 it("should navigate to signup page", () => {
   cy.get('.create-account-button').click();
   cy.url().should("include", "/signup");
 });

 it("should maintain authentication after refresh", () => {
   cy.window().then((win) => {
     win.localStorage.setItem("authToken", "fake-jwt-token");
   });

   cy.visit("http://localhost:8100/tasklist");
   cy.url().should("include", "/tasklist");
 });

 it("should handle network errors", () => {
   cy.intercept("POST", "http://localhost:5050/api/auth/login", {
     forceNetworkError: true
   }).as("loginAttempt");

   cy.get('ion-input[placeholder="Email"]').type("test@example.com");
   cy.get('ion-input[placeholder="Password"]').type("password123");
   cy.get('.signin-button').click();

   cy.get(".error-message").should("contain", "Network error");
 });

 it("should clear error message when typing", () => {
   cy.get('.signin-button').click();
   cy.get(".error-message").should("exist");

   cy.get('ion-input[placeholder="Email"]').type("a");
   cy.get(".error-message").should("not.exist");
 });
});