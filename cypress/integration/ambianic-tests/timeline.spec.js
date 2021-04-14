/// <reference types="cypress" />

context("Timeline", () => {
  before(() => {
    cy.visit("http://localhost:8080");
    //   cy.get('[data-cy=timeline]').click()
    cy.visit("./timeline");
  });

  it("Should browse to timeline", () => {
    cy.url().should("include", "/timeline");
  });

  it("Should render connection card", () => {
    cy.get("[data-cy=connectioncard]").contains(
      "Connecting to Ambianic Edge device..."
    );
  });
});
