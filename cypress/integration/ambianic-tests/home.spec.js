/// <reference types="cypress" />
context('HomePage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Loads title and subtitle', () => {
    cy.get('.v-list-item__title')
      .should('contain.text', 'Cozy at Home')

    cy.get('.v-list-item__subtitle')
      .should('contain.text', 'via Ambient Intelligence')
  })

  it('Loads timeline button', () => {
    cy.get('#btn-timeline > .v-btn__content')
      .should('contain.text', 'View Timeline')
      .click()

    cy.url().should('include', '/timeline')
  })

  it('Loads settings button', () => {
    cy.get('#btn-settings > .v-btn__content')
      .should('contain.text', 'Settings')
      .click()

    cy.url().should('include', '/settings')
  })
})
