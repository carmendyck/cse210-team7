/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Extend Cypress types to recognize custom commands
declare namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      waitForFirestore(): Chainable<void>;
    }
  }

Cypress.Commands.add("login", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("authUser", JSON.stringify({ uid: "aNlyq8aiGeS8VmMGzjjDuugSBXy2", email: "db_test@gmail.com" }));
    });
  });

  Cypress.Commands.add("waitForFirestore", () => {
    cy.intercept("GET", "**/api/viewTask/getTask/**", { fixture: "taskview.json" }).as("getTask");
    cy.wait("@getTask");
  });
  
  
