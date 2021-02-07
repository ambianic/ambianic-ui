/**
 * This test will only work while the EC2 machines are running.
 */

/// <reference types="cypress" />

const checkViewPort = (cy, device) => {
    cy.viewport(device)
    cy.get('#toggle-visibility').should('be.visible')
    cy.get('#peerId-container').should('be.visible')
}

context('RemoteConnections',    () => {
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

    it('Displays elements in smaller viewports', () => {
        cy.get('#remotePeerID').type('917d5f0a-6469-4d33-b5c2-efd858118b74')
        cy.get('#btn-sendRemotePeerID').click()

        // ensure elements are shown on smaller viewports
        checkViewPort(cy, 'iphone-5')
        checkViewPort(cy, 'iphone-6')
        checkViewPort(cy, 'samsung-s10')
        checkViewPort(cy, 'samsung-note9')
        checkViewPort(cy, 'iphone-x')
        checkViewPort(cy, 'iphone-xr')

        checkViewPort(cy, 'ipad-mini')
        checkViewPort(cy, 'ipad-2')
        checkViewPort(cy, 'macbook-11')
        checkViewPort(cy, 'macbook-13')
    })
})
