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
  });
  