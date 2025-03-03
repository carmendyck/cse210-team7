/// <reference types="cypress" />

describe('Breaks Page', () => {
    beforeEach(() => {
      // Mock the AuthContext and API calls
      cy.intercept('http://localhost:5050/api/breaks/updateBreaks', {
        statusCode: 200,
        body: { message: 'Preferences saved successfully' },
      }).as('savePreferences');
  
      cy.visit('/breaks'); // Assuming your route is /breaks
    });
  
    it('should display the page title', () => {
      cy.get('ion-title').should('contain', 'Break Preferences');
    });
  
    it('should allow changing work duration with the range slider', () => {
      cy.get('ion-range[value="30"]')
        .find('.range-knob')
        .invoke('attr', 'style', 'transform: translateX(100px);') // Simulate dragging
        .trigger('mouseup');
  
      cy.get('ion-range[value="30"]').should('not.exist');
      cy.get('ion-range[value="60"]').should('exist'); // Assuming dragging moved it to 60
    });
  
    it('should allow changing break duration with the range slider', () => {
      cy.get('ion-range[value="5"]')
        .find('.range-knob')
        .invoke('attr', 'style', 'transform: translateX(100px);') // Simulate dragging
        .trigger('mouseup');
  
      cy.get('ion-range[value="5"]').should('not.exist');
      cy.get('ion-range[value="32"]').should('exist'); // Assuming dragging moved it to 32
    });
  
    it('should allow toggling break type checkboxes', () => {
      cy.get('ion-checkbox').contains('Water Break').click();
      cy.get('ion-checkbox').contains('Water Break').should('not.have.class', 'checkbox-checked');
  
      cy.get('ion-checkbox').contains('Snack Break').click();
      cy.get('ion-checkbox').contains('Snack Break').should('not.have.class', 'checkbox-checked');
  
      cy.get('ion-checkbox').contains('Active Break').click();
      cy.get('ion-checkbox').contains('Active Break').should('not.have.class', 'checkbox-checked');
  
      cy.get('ion-checkbox').contains('Meditation Break').click();
      cy.get('ion-checkbox').contains('Meditation Break').should('not.have.class', 'checkbox-checked');
  
      cy.get('ion-checkbox').contains('Water Break').click();
      cy.get('ion-checkbox').contains('Water Break').should('have.class', 'checkbox-checked');
    });
  
    it('should save preferences and redirect to preferences page', () => {
      // Modify range values
      cy.get('ion-range[value="30"]')
        .find('.range-knob')
        .invoke('attr', 'style', 'transform: translateX(100px);')
        .trigger('mouseup');
  
      cy.get('ion-range[value="5"]')
        .find('.range-knob')
        .invoke('attr', 'style', 'transform: translateX(100px);')
        .trigger('mouseup');
  
      // Toggle a checkbox
      cy.get('ion-checkbox').contains('Water Break').click();
  
      // Click the save button
      cy.contains('Save').click();
  
      // Verify the loading indicator
      cy.get('ion-loading').should('be.visible');
  
      // Wait for the API call to complete
      cy.wait('@savePreferences').then(() => {
        // Verify redirection
        cy.url().should('include', '/preferences');
      });
    });
  
    it('should handle API errors gracefully', () => {
      // Intercept the API call and simulate an error
      cy.intercept('http://localhost:5050/api/breaks/updateBreaks', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('savePreferencesError');
  
      cy.contains('Save').click();
  
      cy.wait('@savePreferencesError').then(() => {
        // Optionally, you can assert that an error message is displayed
        cy.get('ion-loading').should('not.exist'); // Loading should disappear
      });
    });
  
    it('should navigate back to preferences page on back button click', () => {
      cy.get('ion-back-button').click();
      cy.url().should('include', '/preferences');
    });
  });