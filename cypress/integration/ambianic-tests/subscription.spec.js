/// <reference types="cypress" />

context('SubscriptionModal', () => {
  before(() => {
    cy.visit('http://localhost:8080/timeline')
  })

  it('Should launch subscription modal', () => {
    cy.get('[data-cy=auth-btn]').click()
  })

  it('It displays input fields', () => {
    cy.get('[data-cy=subscribe]').click()

    cy.get('[name=cardHolderName]').should('be.visible')
    cy.get('[name=cardNumber]').should('be.visible')
    cy.get('[name=emailAddress]').should('be.visible')
  })

  it('It validates card-number regex is functional', () => {
    // TODO: enabled after cards have been tested
    // cy.get('[data-cy=confirm-btn]').should('be.disabled')

    cy.get('[name=cardNumber]').type('4242424242424242')

    cy.get('[data-cy=confirm-btn]').should('be.enabled')
  })

  it('It contains 7 input forms', () => {
    cy.get('input').its('length').should('be.eq', 7)
  })

  it('should dismiss subscription modal', () => {
    cy.get('[data-cy=dismiss-modal]').click()
  })
})
