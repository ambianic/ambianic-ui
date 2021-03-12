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

  // it("Should load mock data in timeline", () => {
  //   cy.get("[data-cy=load-mock-data]").click();

  //   cy.get("[data-cy=connectioncard]").should("not.exist");

  //   cy.get("[data-cy=timelinedata]").should("be.visible");
  // });

  // it("Load 8 mock detections as timeline data", () => {
  //   cy.get("[data-cy=timelinedata]").then((result) => {
  //     expect(result).to.have.lengthOf(8);
  //   });
  // });

  // it("Should display detection element buttons", () => {
  //   cy.get("[data-cy=bell-btn]").should("be.visible");
  //   cy.get("[data-cy=check-btn]").should("be.visible");
  //   cy.get("[data-cy=heart-btn]").should("be.visible");
  //   cy.get("[data-cy=edit-btn]").should("be.visible");
  //   cy.get("[data-cy=share-btn]").should("be.visible");
  // });

  // it("Displays timeline item", () => {
  //   const timelineItem = cy.get("[data-cy=timeline-item]")

  //   timelineItem.should("exist");
  // });
});
