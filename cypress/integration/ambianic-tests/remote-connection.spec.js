/**
 * This test will only work while the EC2 machines are running.
 */

/// <reference types="cypress" />

context('RemoteConnections', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/settings')
    })

    // NOTE: this test commented out because it depends on an external edge server
    // it should be activated again when the CI is setup to run a localhost edge.
    // it('Should be connected automatically', () => {
    //     cy.get('#btn-settings').click()
    //     cy.wait(8000)
    //     cy.get('#peerID').contains('5568ec87-42d8-47b0-aeea-01a125db0623')
    // })

    it('Should retrieve and display user PeerID', () => {
        // cy.get('#btn-settings').click()
        cy.get('#remotePeerID').type('917d5f0a-6469-4d33-b5c2-efd858118b74')
        cy.get('#btn-sendRemotePeerID').click()

        // makes sure ID is hidden by default
        cy.get('input').should('not.have.value', '917d5f0a-6469-4d33-b5c2-efd858118b74')
        // reveal hidden PeerID
        cy.get('#toggle-visibility').click()
        cy.get('#peerId-container').should('have.value', '917d5f0a-6469-4d33-b5c2-efd858118b74')
    })
})