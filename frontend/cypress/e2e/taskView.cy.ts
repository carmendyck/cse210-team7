/// <reference types="cypress" />

describe("ViewTask Page", () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.visit("http://localhost:8100/login");
      cy.get('.login-container').should('be.visible');
      // Log in before each test if needed (adjust based on your auth method)
      cy.intercept("POST", "http://localhost:5050/api/auth/login", {
        statusCode: 200,
        body: { token: "fake-jwt-token" }
      }).as("loginAttempt");
   
      cy.get('ion-input[placeholder="Email"]').type("valid@example.com");
      cy.get('ion-input[placeholder="Password"]').type("validpassword");
      cy.get('.signin-button').click();
      cy.wait("@loginAttempt");
  
      // Intercept API call before visiting
      cy.intercept("GET", "http://localhost:5050/api/viewTask/getTask/*", { fixture: "taskview.json" }).as("getTask");

      cy.visit("http://localhost:8100/viewtask/123"); // Navigate to the page

      cy.wait("@getTask"); // Wait for task data to load
    });
  
    it("should display 'View Task' on the page", () => {
      cy.contains("View Task").should("be.visible");
    });
  
    it("should show 'Start Task' button", () => {
      cy.contains("Start Task").should("be.visible");
    });
  
    it("should start the task and toggle between 'Pause Task' and 'Resume Task'", () => {
      // Click "Start Task"
      cy.contains("Start Task").click();
  
      // Ensure "Stop Task" appears
      cy.contains("Stop Task").should("be.visible");
  
      // Ensure "Pause Task" appears
      cy.contains("Pause Task").should("be.visible").click();
  
      // Ensure it toggles to "Resume Task"
      cy.contains("Resume Task").should("be.visible").click();
  
      // Ensure it toggles back to "Pause Task"
      cy.contains("Pause Task").should("be.visible");
    });
    
  
    // Specific task details
    it('should load the task details', () => {
      cy.wait('@getTask');
      cy.get('h1').should('contain', 'Example task'); 
      cy.get('.details').should('contain', 'Due:');
      cy.get('.details').should('contain', 'Time Estimated:');
      cy.get('.details').should('contain', 'Time Spent:');
    });

    // Timer starts at 0
    it('should have timer start at 00:00:00', () => {
      cy.wait('@getTask');
      cy.get('.timer-display').should('contain', '00:00:00');
    });

    // Timer changes value when started
    it('should start and stop the timer', () => {
      cy.wait('@getTask');
      cy.get('.timer-button').contains('Start Task').click();
      cy.get('.timer-display').should('not.contain', '00:00:00');
      cy.get('.timer-button').contains('Stop Task').click();
    });

    // Make sure modal opens 
    it("should show 'Enter Time Manually' button", () => {
      cy.contains("Enter Time Manually").should("be.visible");
    });
    it('should open the manual time entry modal', () => {
      cy.wait('@getTask');
      cy.get('.manual-time').click();
      cy.get('.manual-time-modal').should('be.visible');
    });
  
    // Completed checkbox
    it("should show 'Task Completed' area", () => {
      cy.contains("Task Completed").should("be.visible");
    });
    it('should mark the task as completed', () => {
      cy.wait('@getTask');
      cy.get('.completed-checkbox').check();
      cy.get('.completed-checkbox').should('be.checked');
      cy.get('.completed-checkbox').uncheck();
      cy.get('.completed-checkbox').should('not.be.checked');
    });
  
    // Back button
    it('should navigate back to task list', () => {
      cy.wait('@getTask');
      cy.get('.back-button').click();
      cy.url().should('include', '/tasklist');
    });

  });
  