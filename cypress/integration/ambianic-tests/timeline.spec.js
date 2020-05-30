/**
 * This test will only work while the EC2 machines are running.
 */

/// <reference types="cypress" />

context('RemoteConnections', () => {
    beforeEach(() => {
      cy.visit('http://18.219.76.94')
    })

    it('Should browse to timeline', () => {
        cy.get('[data-cy=timeline]').click()

        cy.url().should('include', '/timeline')
    })

    it('Should render connection card', () => {
        cy.get('[data-cy=timeline]').click()

        cy.get('.mx-auto').contains('Connecting to Ambianic Edge device...')
    })

    /**
     * This will be removed once we have decided on the flow
     * for future layout/flow in UI / Edge connection
     */
    it('Should browse to edgeconnect', () => {
        cy.get('[data-cy=timeline]').click()

        cy.wait(500)

        cy.get('[data-cy=settings]').click()

        cy.url().should('include', '/edge-connect')
    })

    it('Should generate no results in timeline', () => {
        cy.get('[data-cy=timeline]').click()

        cy.wait(5000)

        cy.get('.infinite-status-prompt').contains('No results :(')
    })
})