/// <reference types="cypress" />

describe("Task List Page", () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.visit("http://localhost:8100/login");
      cy.get('.login-container').should('be.visible');
  
      cy.intercept("POST", "http://localhost:5050/api/auth/login", {
        statusCode: 200,
        body: { token: "fake-jwt-token" }
      }).as("loginAttempt");
      
      cy.get('ion-input[placeholder="Email"]').type("valid@example.com");
      cy.get('ion-input[placeholder="Password"]').type("validpassword");
      cy.get('.signin-button').click();
      cy.wait("@loginAttempt");
  
      cy.intercept("GET", "http://localhost:5050/api/tasklist/getAllTasks/*", {
        fixture: "tasklist.json"
      }).as("getTasks");
  
      cy.visit("http://localhost:8100/tasklist");
      cy.wait("@getTasks");
    });
  
    it("should display the title 'Task List' on the page", () => {
        cy.get("ion-title").first().should("have.text", "Task List");
    });
      
    it("should render the date selection component correctly", () => {
        cy.get("ion-datetime").should("exist").and("be.visible");
        cy.get("ion-datetime")
          .invoke("attr", "value")
          .should("match", /^\d{4}-\d{2}-\d{2}$/);
      });

  });
  