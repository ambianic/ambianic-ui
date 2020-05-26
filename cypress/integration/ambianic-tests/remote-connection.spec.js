/**
 * This test will only work while the EC2 machines are running.
 */

/// <reference types="cypress" />

context('RemoteConnections', () => {
    beforeEach(() => {
      cy.visit('http://18.219.76.94')
    })

    it('Should be connected automatically', () => {

        cy.get('#btn-settings').click()
        
        cy.wait(6000)
        
        cy.get('#peerID').should('contain-text', '5568ec87-42d8-47b0-aeea-01a125db0623')
    })

    it('Should switch to a remote Edge', () => {

        cy.get('#btn-settings').click()
        
        cy.wait(6000)

        cy.get('input[name="remotePeerID"]').invoke('8a9f5dbe-d8ee-4883-8ed6-8067ca2f1f39')

        cy.get('#sendRemotePeerID').click()
        
        cy.get('#peerID').should('contain-text', '8a9f5dbe-d8ee-4883-8ed6-8067ca2f1f39')
    })
})