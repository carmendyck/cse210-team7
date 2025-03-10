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

    // Intercept API call before visiting View Task
    cy.intercept("GET", "http://localhost:5050/api/viewTask/getTask/*", { fixture: "taskview.json" }).as("getTask");
    cy.visit("http://localhost:8100/viewtask/123"); // Navigate to the page
    cy.wait("@getTask"); // Wait for task data to load

    // Intercept API call before visiting Edit Task
    cy.intercept("GET", "http://localhost:5050/api/viewTask/getTask/*", { fixture: "taskview.json" }).as("getTask");
    cy.get('.edit-button').click();
    cy.wait("@getTask");
  });

  // =========================
  //         Page view
  // =========================
  it("should import data from viewed task successfully in the Edit Task form", () => {
    cy.get("ion-title").should('have.text', 'Edit Task');
    cy.get("ion-input").eq(0).should('have.value', "Example task");  // name -- NOTE: cypress tests are inconsistent with aria-label
    cy.get("ion-input").eq(1).should('have.value', "description");  // notes
    cy.get("ion-input").eq(2).should('exist');  // location

    cy.get("ion-datetime").eq(0).should('exist');
    cy.get("ion-datetime").eq(0).find('span[slot="title"]').should('have.text', 'Due date/time');

    // cy.get("ion-select[label='Course']").should('exist');  // uncommented until courses are fully connected
    cy.get("ion-select[label='Tags']").should('exist');
    // cy.get("ion-input[label='Time Estimate (hours)']").find('input').should('have.value', 3);
    cy.get('ion-toggle').eq(0).should('exist');
    cy.get('.create-task-button').should('exist');
  });

  // ====================================================
  //         Input updating and input validation
  // ====================================================
  it("should correctly update the task name input field", () => {
    const newTaskName = "- This is a task name";
    cy.get("ion-input").eq(0).type(newTaskName);
    cy.get("ion-input").eq(0).find('input').should('have.value', "Example task" + newTaskName);
  });

  it("should not allow users to surpass the set max character length for names", () => {
    const maxLength = 50;

    // Enter invalid task name (longer than 50 characters), and check that length is <= 50
    const invalidTaskName = "A ".repeat(60);
    cy.get("ion-input").eq(0).find('input').clear().type(invalidTaskName);

    // Check that invalid long name is truncated
    const truncatedName = invalidTaskName.slice(0, maxLength);
    cy.get("ion-input").eq(0).find('input').should('have.value', truncatedName);
    cy.get("ion-input").eq(0).find('input').invoke('val').should('have.length.lessThan', maxLength + 1);
  });

  it("should correctly update the task notes input field", () => {
    const newNotes = "- This is a note for the task";
    cy.get("ion-input").eq(1).type(newNotes);
    cy.get("ion-input").eq(1).find('input').should('have.value', "description" + newNotes);
  });

  it("should correctly update the task location input field", () => {
    const newLocation = "New Location";
    cy.get("ion-input").eq(2).type(newLocation);
    cy.get("ion-input").eq(2).find('input').should('have.value', newLocation);
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
      cy.get('body').click(0, 0);  // exit time pickergi

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

  it("should correctly update the tags field", () => {
    const selectedTags = ["Assignment", "Exam"];

    // Open Tags selection, select tags, and click OK
    cy.get("ion-select[label='Tags']").click();
    selectedTags.forEach((tag) => {
      cy.contains(".alert-checkbox-label", tag).parent().click();
    });
    cy.get('button').contains('OK').click();

    // Verify that the tags field is updated with the selected tags
    cy.get("ion-select[label='Tags']").shadow().find("div.select-text").should("contain.text", selectedTags.join(", "));
  });

  // it("should correctly update the task time estimate input field", () => {
  //   // Default value should be 3 from pre-created task
  //   cy.get("ion-input[label='Time Estimate (hours)']").find('input').should('have.value', 3);

  //   // Set valid input, check value
  //   const taskTime = "5";
  //   cy.get("ion-input[label='Time Estimate (hours)']").find('input').clear()
  //   cy.get("ion-input[label='Time Estimate (hours)']").find('input').type("{moveToEnd}" + taskTime);
  //   cy.get("ion-input[label='Time Estimate (hours)']").find('input').should('have.value', taskTime);
  // });

  // it("should not allow negative or non-numeric time estimates", () => {
  //   // Negative numbers should trigger reverting field to 0
  //   const negativeTime = "5{moveToStart}-";
  //   cy.get("ion-input[label='Time Estimate (hours)']").find('input').clear().type(negativeTime);
  //   cy.get("ion-input[label='Time Estimate (hours)']").find('input').should('have.value', 0);
  // });

  // ==============================
  //         Task creation
  // ==============================
  it("should display an error when trying to create a task without a name", () => {
    cy.get("ion-input").eq(0).find('input').clear();
    cy.get('.create-task-button').click();
    cy.get('.invalid-task-message').should('exist');
  });

  it("should successfully submit form when creating a valid task", () => {
    cy.fixture('newtask.json').then((fixtureData) => {
      cy.intercept('PATCH', 'http://localhost:5050/api/createTasks/updatetask/123', {
        statusCode: 200,
        body: {
          message: 'Task updated successfully!',
          taskId: '123', // mock taskId
          task: fixtureData.newTask, // use the mock task data from the fixture-- not accurate!
        },
      }).as('createTask');
    });

    // Change task name
    const newTaskName = "This is a NEW task name, I've updated it!";
    cy.get("ion-input").eq(0).find('input').clear().type(newTaskName);
    cy.get("ion-input").eq(0).find('input').should('have.value', newTaskName);
    cy.get('.create-task-button').click();

    // Update task
    // cy.wait("@createTask", { timeout: 10000 });
    // cy.url().should("include", "/viewtask/123");
  });
});