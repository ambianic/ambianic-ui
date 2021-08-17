/// <reference types="cypress" />
context('HelpPage', () => {
  beforeEach(() => {
    cy.visit('/help')
  })

  it('Look at page title and subtitle', () => {
    cy.get('#help-title > .v-list-item__content > .v-list-item__title')
      .contains('Need Help with Ambianic?', { matchCase: false })

    cy.get('#help-title > .v-list-item__content > .v-list-item__subtitle')
      .contains('Please reference our online docs or connect on Twitter', { matchCase: false })
  })

  it('Check docs button', () => {
    cy.get('#btn-docs')
      .should('have.attr', 'href', 'https://docs.ambianic.ai')
      .get('.v-btn__content')
      .contains('Documentation', { matchCase: false })
  })

  it('Check community button', () => {
    cy.get('#btn-community')
      .should('have.attr', 'href', 'https://twitter.com/ambianicai')
      .get('.v-btn__content')
      .contains('Twitter', { matchCase: false })
  })
})
