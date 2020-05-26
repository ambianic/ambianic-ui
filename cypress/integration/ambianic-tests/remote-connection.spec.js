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
        
        cy.wait(8000)
        
        cy.get('#peerID').contains('5568ec87-42d8-47b0-aeea-01a125db0623')
    })

    it('Should switch to a remote Edge', () => {

        cy.get('#btn-settings').click()

        cy.get('#remotePeerID').type('917d5f0a-6469-4d33-b5c2-efd858118b74')

        cy.get('#btn-sendRemotePeerID').click()
        
        cy.wait(8000)

        cy.get('#peerID').contains('917d5f0a-6469-4d33-b5c2-efd858118b74')
    })
})