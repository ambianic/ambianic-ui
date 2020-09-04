/// <reference types="cypress" />

context('Setup Edge With Bluetooth', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/setup')
    })

    it('Should have a top layout card', () => {
      cy.get('[data-cy=basecard]').should('exist')
    })

    // To be removed once a list of selectable wifis are implemented
    it('Should have a wifi card', () => {
      cy.get('[data-cy=wifi-button]').click()
      cy.get('[data-cy=wifi-card]').contains('Enter Wifi Details')
    })
    

    // Commented away until select wifis by list is implemented
    // it('Should have a wifi card', () => {
    //   cy.get('[data-cy=wifi-button]').click()
    //   cy.get('[data-cy=wifi-card]').contains('WIFIS FOUND')
    //   cy.get('[data-cy=close-dialog]').click()
    // })

    // it('Should have a five wifis', () => {
    //   cy.get('[data-cy=wifi-button]').click()
    //   cy.get('[data-cy=wifis]').then(($result => {
    //     assert.equal($result.length,5)
    //   }))
    // })
})