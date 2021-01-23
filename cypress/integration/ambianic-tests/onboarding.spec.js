/// <reference types="cypress" />

context("Onboarding", () => {
  before(() => {
    cy.visit("http://localhost:8080");
    cy.get("[data-cy=timeline]").click();
  });

  it("Should have a splashscreen installation card", () => {
    cy.get("[data-cy=installationCard]");
  });

  it("Should have a messaging option modal", () => {
    cy.get("[data-cy=messaging-option-modal]");
  });

  it("Should have three installation steps", () => {
    cy.get("[data-cy=stepper]").should("have.length", 3);
  });

  it("It executes first installation step and installs App", () => {
    cy.get("[data-cy=install-app]").click();

    cy.get("[data-cy=continue-installation]").click();
  });

  it("It confirms remote request message and request grant", () => {
    cy.get("[data-cy=continue-step-2]").click();
    cy.get("[data-cy=remote-button]").click();
    cy.get("[data-cy=request-access]").click();

    cy.get("[data-cy=send-message]").click();
    cy.get("[data-cy=select-client]").click();
  });

  it("Should have PeerID input field and enabled Submit button after validation", () => {
    cy.get('input[name="peerid-input"]').type(
      "917d5f0a-6469-4d33-b5c2-efd858118b74"
    );
    cy.get("[data-cy=submit-button]").should("be.enabled");
  });
});
