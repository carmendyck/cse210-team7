/// <reference types="cypress" />

describe("CreateTask Page", () => {
  beforeEach(() => {
    cy.clearAllCookies();
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

    // Wait for the page to load before running tests
    cy.wait(2000);
    cy.get('ion-content').should('be.visible');
    cy.get("ion-input", { timeout: 15000 }).eq(0).should('be.visible');
  });

  // =========================
  //         Page view
  // =========================
  it("should display the create task form correctly", () => {
    cy.get("ion-title").should('have.text', 'Create Task');
    cy.get("ion-input").eq(0).should('exist');  // name -- NOTE: cypress tests are inconsistent with aria-label
    cy.get("ion-input").eq(1).should('exist');  // notes
    cy.get("ion-input").eq(2).should('exist');  // location
    cy.get("ion-datetime").eq(0).should('exist');
    cy.get("ion-datetime").eq(0).find('span[slot="title"]').should('have.text', 'Due date/time');
    // cy.get("ion-select[label='Course']").should('exist');  // uncommented until courses are fully connected
    cy.get("ion-select[label='Tags']").should('exist');
    cy.get("ion-input[label='Time Estimate (hours)']").should('exist');
    cy.get('ion-toggle').eq(0).should('exist');
    cy.get('.create-task-button').should('exist');
  });

  // ====================================================
  //         Input updating and input validation
  // ====================================================
  it("should correctly update the task name input field", () => {
    const newTaskName = "This is a task name";
    cy.get("ion-input").eq(0).type(newTaskName);
    cy.get("ion-input").eq(0).find('input').should('have.value', newTaskName);
  });

  it("should correctly update the task time estimate input field", () => {
    // Default value should be 1
    cy.get("ion-input[label='Time Estimate (hours)']").find('input').should('have.value', 1);

    // Set valid input, check value
    const taskTime = "5";
    cy.get("ion-input[label='Time Estimate (hours)']").find('input').clear()
    cy.get("ion-input[label='Time Estimate (hours)']").find('input').type("{moveToEnd}" + taskTime);
    cy.get("ion-input[label='Time Estimate (hours)']").find('input').should('have.value', taskTime);
  });

  it("should not allow negative or non-numeric time estimates", () => {
    // Negative numbers should trigger reverting field to 0
    const negativeTime = "5{moveToStart}-";
    cy.get("ion-input[label='Time Estimate (hours)']").find('input').clear().type(negativeTime);
    cy.get("ion-input[label='Time Estimate (hours)']").find('input').should('have.value', 0);
  });

  it("should correctly update the due date input field when inputs are changed", () => {
    // Set due date to exactly 1 week later at 10AM
    const inOneWeek = new Date();
    inOneWeek.setDate(inOneWeek.getDate() + 7);
    const day = inOneWeek.getDate();
    const month = inOneWeek.getMonth() + 1; // months are 0-indexed
    const year = inOneWeek.getFullYear();
    const hour = '10';
    const minute = '00';
    const period = 'AM';

    // Format the selected date string (e.g., "Sat, Mar 1")
    const formattedDate = inOneWeek.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const expectedTime = '' + hour + ':' + minute + ' ' + period;

    // Set new due date and due time
    cy.get('ion-datetime').shadow().find('button')
      .filter(`[data-day="${day}"][data-month="${month}"][data-year="${year}"]`)
      .should('exist').click({ force: true });

    cy.get('ion-datetime').shadow().find('.time-body').click();  // access due time picker
    cy.get('.popover-viewport', { timeout: 10000 }).should('be.visible')
      .within(() => {
        cy.get('ion-picker-column[aria-label="Select an hour"]').find('ion-picker-column-option')
          .contains(hour).shadow().find('button').click({ force: true });
        cy.get('ion-picker-column[aria-label="Select a minute"]').find('ion-picker-column-option')
          .contains(minute).shadow().find('button').click({ force: true });
        cy.get('ion-picker-column[aria-label="Select a day period"]').find('ion-picker-column-option')
          .contains(period).shadow().find('button').click({ force: true });
      });
      cy.get('body').click(0, 0);  // exit time picker

    // Verify that the selected date and time are 1 week later at 10AM
    cy.get('ion-datetime').shadow().find('.datetime-selected-date').should('have.text', formattedDate);
    cy.get('ion-datetime').shadow().find('.time-body').should('have.text', expectedTime);
  });

  it("should not allow due dates in the past", () => {
    // Set due date to exactly 1 week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const day = oneWeekAgo.getDate();
    const month = oneWeekAgo.getMonth() + 1; // months are 0-indexed
    const year = oneWeekAgo.getFullYear();

    // Check that invalid date button is disabled
    cy.get('ion-datetime').shadow().find('button')
      .filter(`[data-day="${day}"][data-month="${month}"][data-year="${year}"]`)
      .should('exist').should('have.attr', 'disabled');
  });

  it("should not allow users to surpass the set max character length for names", () => {
    const maxLength = 50;

    // Enter invalid task name (longer than 50 characters), and check that length is <= 50
    const invalidTaskName = "A ".repeat(60);
    cy.get("ion-input").eq(0).type(invalidTaskName);

    // Check that invalid long name is truncated
    const truncatedName = invalidTaskName.slice(0, maxLength);
    cy.get("ion-input").eq(0).find('input').should('have.value', truncatedName);
    cy.get("ion-input").eq(0).find('input').invoke('val').should('have.length.lessThan', maxLength + 1);
  });

  // ==============================
  //         Task creation
  // ==============================
  it("should display an error when trying to create a task without a name", () => {
    cy.get("ion-input").eq(0).find('input').clear();
    cy.get('.create-task-button').click();
    cy.get('.invalid-task-message').should("contain", "<Name> is required!");
  });

  // it("should successfully submit form when creating a valid task", () => {

  // });

  // it("should return to the tasklist page when task is successfully added to database", () => {

  // });
});