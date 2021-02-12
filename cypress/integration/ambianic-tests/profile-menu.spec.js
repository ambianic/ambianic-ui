/// <reference types="cypress" />

context('Profile menu', () => {
  before(() => {
    cy.visit('http://localhost:8080/timeline')
  })

  it('Should start authentication with Auth0', () => {
    cy.get('[data-cy=display-profile]').click()

  })

  it('Confirm Profile Card Elements', () => {
    cy.get('[data-cy=profile-toggle]').click()
    cy.get('.v-list-item__title')
      .should('contain.text', 'Test User')
  
    cy.get('.v-list-item__subtitle')
      .should('contain.text', 'test@gmail.com')
  
    cy.get('[data-cy=logout-button]').should('be.visible')
  })
  
  it('Should open subscription modal', () => {
    cy.get('[data-cy=add-subscription]').click()
    cy.get('[data-cy=dismiss-modal]').click()
  })
})
