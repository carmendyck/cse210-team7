describe("Login Page Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8100/login");
  });

  // First test is to check if login form elements are displayed correctly
  it("should display the login form correctly", () => {
    cy.get("h1").should("contain", "Login");
    cy.get(".welcome-text").should("contain", "Welcome back! Please log in.");
    cy.get("input[placeholder='Email']").should("be.visible");
    cy.get("input[placeholder='Password']").should("be.visible");
    cy.get(".forgot-password").should("be.visible").contains("Forgot your password?");
    cy.get(".sign-in-button").should("be.visible");
    cy.get(".create-account-button").should("be.visible");
  });

  // Show error if login is attempted with empty or missing fields
  it("should show an error message when fields are empty", () => {
    cy.get(".sign-in-button").click();
    cy.get(".message-text").should("contain", "Please enter both your email and password.");
  });

  // Stop or prevent login with incorrect password
  it("should not log in with invalid credentials", () => {
    cy.intercept("POST", "http://localhost:5050/api/auth/login", {
      statusCode: 401,
      body: { error: "INVALID_PASSWORD" },
    }).as("loginRequest");

    cy.get("input[placeholder='Email']").type("test@example.com");
    cy.get("input[placeholder='Password']").type("wrongpassword");
    cy.get(".sign-in-button").click();

    cy.wait("@loginRequest");
    cy.get(".message-text").should("contain", "Incorrect password. Please try again.");
  });


  // Redirect to signup if user does not exist
  it("should redirect to signup if user does not exist", () => {
    cy.intercept("POST", "http://localhost:5050/api/auth/login", {
      statusCode: 404,
      body: { error: "EMAIL_NOT_FOUND" },
    }).as("loginRequest");

    cy.get("input[placeholder='Email']").type("doesnotexist@example.com");
    cy.get("input[placeholder='Password']").type("password123");
    cy.get(".sign-in-button").click();

    cy.wait("@loginRequest");
    cy.get(".message-text").should("contain", "⚠️ User does not exist. Redirecting to sign-up...");

    cy.wait(4000);
    cy.url().should("eq", "http://localhost:8100/signup");
  });


  // This allows successful login and redirect to task list
  it("should log in successfully and redirect to task list", () => {
    cy.intercept("POST", "http://localhost:5050/api/auth/login", {
      statusCode: 200,
      body: { token: "fake-jwt-token" },
    }).as("loginRequest");

    cy.get("input[placeholder='Email']").type("tester@gmail.com ");
    cy.get("input[placeholder='Password']").type("Mytest123");
    cy.get(".sign-in-button").click();

    cy.wait("@loginRequest");

    cy.url().should("eq", "http://localhost:8100/tasklist");
  });

  // This is to ensure user stays logged in after refresh as token
  // is stored in local storage

  it("should keep the user logged in after refresh", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("authToken", "fake-jwt-token");
    });
    cy.visit("http://localhost:8100/tasklist");

    cy.url().should("eq", "http://localhost:8100/tasklist");
  });
})