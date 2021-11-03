/// <reference types="cypress" />

context('Check Navbar Items', () => {
  before(() => {
    cy.visit('/about')
  })

  it('Should display a connection-offline icon before edge connection', () => {
    cy.get('[data-cy=connection-status]')
      .should('exist')
      .should('be.visible').click()
      cy.url().should('include', '/settings')
  })

  it('Should be a settings button', () => {
    cy.get('[data-cy=settings-btn]').should('exist')
  })

  it('Should have a five links', () => {
    cy.get('[data-cy=drawer]').then(($result) => {
      assert.equal($result.children().children()[0].childElementCount,5,'Five links in the drawer')
    })
  })

  it('Should have a clickable timeline icon', () => {
    cy.get('[data-cy=timeline-btn]').should('be.visible').click()
    cy.url().should('include', '/timeline')
  })
})
