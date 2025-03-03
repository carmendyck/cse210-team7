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

    // it("should render the date selection component correctly", () => {
    //     cy.get("h2.section-title").contains("Unfinished").should("exist").and("be.visible");
    // });
    
    //   it("should display only incomplete tasks", () => {
    //     cy.contains("Example Task").should("be.visible");
    //     cy.contains("Example Task 2").should("not.exist");
    //   });
    // it("should mark a task as completed and remove it from the list", () => {
    //   cy.intercept("PATCH", "http://localhost:5050/api/viewTask/closeTask/1", {
    //     fixture: "closeTask.json"
    //   }).as("closeTask");
  
    //   cy.contains("Example Task 1")
    //     .parents('ion-item')
    //     .find('ion-checkbox')
    //     .click({ force: true });
      
    //   cy.wait("@closeTask");
  
    //   cy.contains("Example Task").should("not.exist");
    // });
  
    // it("should filter tasks based on the selected date", () => {
    //   cy.get('ion-datetime')
    //     .invoke('attr', 'value', '2025-02-23')
    //     .trigger('ionChange');
  
    //   cy.contains("Example Task 3").should("be.visible");
    // });
  
    // it("should navigate to the login page after clicking Logout", () => {
    //   cy.contains("Logout").click();
    //   cy.url().should("include", "/login");
    // });
  });
  