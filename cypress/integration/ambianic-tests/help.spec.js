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
    let btn = cy.get('#btn-docs')
    btn.should('have.attr', 'href', 'https://docs.ambianic.ai')
    btn.get('.v-btn__content')
      .contains('Documentation', { matchCase: false })
  })

  it('Check community button', () => {
    let btn = cy.get('#btn-community')
    btn.should('have.attr', 'href', 'https://twitter.com/ambianicai')
    btn.get('.v-btn__content')
      .contains('Twitter', { matchCase: false })
  })

})
