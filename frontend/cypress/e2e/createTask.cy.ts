/// <reference types="cypress" />

describe("CreateTask Page", () => {
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

    // Navigate to Create Task page
    cy.visit("http://localhost:8100/createtask"); // Navigate to the page

    // Wait for the page to load before checking for the input
    cy.wait(2000);

    cy.get("ion-input[aria-label='Name']", { timeout: 10000 }).should('be.visible');
  });

  // Page view
  it("should display the create task form correctly", () => {
    cy.get("ion-title").should('have.text', 'Create Task');
    cy.get("ion-input[aria-label='Name']").should('exist');
    cy.get("ion-input[aria-label='Notes']").should('exist');
    cy.get("ion-input[aria-label='Location']").should('exist');

    cy.get("ion-datetime").eq(0).should('exist');
    cy.get("ion-datetime").eq(0).find('span[slot="title"]').should('have.text', 'Due date/time');

    // cy.get("ion-select[label='Course']").should('exist');  // uncommented until courses are fully connected
    cy.get("ion-select[label='Tags']").should('exist');

    cy.get("ion-input[label='Time Estimate (hours)']").should('exist');
    cy.get('ion-toggle').eq(0).should('exist');

    cy.get('.create-task-button').should('exist');
  });

  // Input updating and input validation
  it("should correctly update the task name input field", () => {
    const newTaskName = "This is a task name";
    cy.get("ion-input[aria-label='Name']").type(newTaskName);
    cy.get("ion-input[aria-label='Name']").find('input').should('have.value', newTaskName);
  });

  // it("should not allow negative time estimates", () => {

  // });

  // it("should correctly update the due date input field", () => {

  // });

  it("should not allow users to surpass the set max character length for names", () => {
    const maxLength = 50;

    // Enter valid task name
    const validTaskName = "A ".repeat(25);
    cy.get("ion-input[aria-label='Name']").type(validTaskName);
    cy.get("ion-input[aria-label='Name']").find('input').should('have.value', validTaskName);
    cy.get("ion-input[aria-label='Name']")
      .find('input').invoke('val')
      .should('have.length.lessThan', maxLength + 1);

    // Enter invalid task name (longer than 50 characters), and check that length is <= 50
    const invalidTaskName = "A ".repeat(60);
    cy.get("ion-input[aria-label='Name']").type(invalidTaskName);

    const truncatedName = invalidTaskName.slice(0, maxLength);
    cy.get("ion-input[aria-label='Name']").find('input').should('have.value', truncatedName);

    const val = cy.get("ion-input[aria-label='Name']").find('input').invoke('val');
    console.log(val);
    cy.get("ion-input[aria-label='Name']")
      .find('input').invoke('val')
      .should('have.length.lessThan', maxLength + 1);
  });

  // Task creation
  // it("should display an error when trying to create a task without a name", () => {

  // });

  // it("should successfully submit form when creating a valid task", () => {

  // });

  // it("should return to the tasklist page when task is successfully added to database", () => {

  // });
});