/// <reference types="cypress" />

const { equal } = require("assert")

context('Setup Edge With Bluetooth', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/setup')
    })

    it('Should have a top layout card', () => {
      cy.get('[data-cy=basecard]').should('exist')
    })

    it('Should have a wifi card', () => {
      cy.get('[data-cy=wifi-button]').click()
      cy.get('[data-cy=wifi-card]').contains('WIFIS FOUND')
      cy.get('[data-cy=close-dialog]').click()
    })

    it('Should have a five wifis', () => {
      cy.get('[data-cy=wifi-button]').click()
      cy.get('[data-cy=wifis]').then(($result => {
        assert.equal($result.length,5)
      }))
    })
})