/// <reference types="cypress" />

describe("Notifications Page", () => {
    beforeEach(() => {
      // Mock API response for fetching notification preferences
      cy.intercept("GET", "http://localhost:5050/api/notifications/getNotifications?user_id=*", {
        statusCode: 200,
        body: {
          lock_screen: true,
          in_app: false,
          email: true
        }
      }).as("getNotifications");
  
      // Mock API response for updating notification preferences
      cy.intercept("POST", "http://localhost:5050/api/notifications/updateNotifications", {
        statusCode: 200,
        body: { success: true }
      }).as("updateNotifications");
  
      cy.visit("/notifications");
      cy.wait("@getNotifications");
    });
  
    it("should display notification preferences correctly", () => {
      // Check if toggles reflect the mock data
      cy.get('ion-toggle').eq(0).should("have.class", "toggle-checked"); // Lock Screen (true)
      cy.get('ion-toggle').eq(1).should("not.have.class", "toggle-checked"); // In-App (false)
      cy.get('ion-toggle').eq(2).should("have.class", "toggle-checked"); // Email (true)
    });
  
    it("should allow toggling notification settings", () => {
      // Toggle each switch
      cy.get('ion-toggle').eq(0).click(); // Turn off Lock Screen
      cy.get('ion-toggle').eq(1).click(); // Turn on In-App
      cy.get('ion-toggle').eq(2).click(); // Turn off Email
  
      // Verify the toggles changed
      cy.get('ion-toggle').eq(0).should("not.have.class", "toggle-checked"); // Lock Screen (false)
      cy.get('ion-toggle').eq(1).should("have.class", "toggle-checked"); // In-App (true)
      cy.get('ion-toggle').eq(2).should("not.have.class", "toggle-checked"); // Email (false)
    });
  
    it("should save updated preferences and redirect", () => {
      // Modify preferences
      cy.get('ion-toggle').eq(1).click(); // Enable In-App notifications
  
      // Click the Save button
      cy.get('ion-button').contains("Save").click();
  
      // Check that the saving state is displayed
      cy.get('ion-loading').should("exist");
  
      // Wait for the request to complete
      cy.wait("@updateNotifications");
  
      // Verify redirect to preferences page
      cy.url().should("include", "/preferences");
    });
  
    it("should handle API errors gracefully", () => {
      // Mock an error response for saving preferences
      cy.intercept("POST", "http://localhost:5050/api/notifications/updateNotifications", {
        statusCode: 500,
        body: { error: "Server error" }
      }).as("updateNotificationsError");
  
      // Try to save preferences
      cy.get('ion-button').contains("Save").click();
  
      // Wait for the failing request
      cy.wait("@updateNotificationsError");
  
      // Ensure user is not redirected
      cy.url().should("include", "/notifications");
  
      
    });
  });
  