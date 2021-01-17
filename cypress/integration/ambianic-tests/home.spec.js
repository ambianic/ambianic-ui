/// <reference types="cypress" />
context('HomePage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Loads title and subtitle', () => {
    cy.get('.v-list-item__subtitle')
      .should('contain.text', 'Cozy at Home - via Ambient Intelligence')
  })

  it('Loads firsttime installation button', () => {
    cy.get('#btn-timeline > .v-btn__content')
      .should('contain.text', 'Continue Setup')
      .click()
  })
})
