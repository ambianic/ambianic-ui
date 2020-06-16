/// <reference types="cypress" />

context('Timeline', () => {
    before(() => {
      cy.visit('http://localhost:8080')
      cy.get('[data-cy=timeline]').click()
    })

    it('Should browse to timeline', () => {
        cy.url().should('include', '/timeline')
    })

    it('Should render connection card', () => {
        cy.get('[data-cy=connectioncard]').contains('Connecting to Ambianic Edge device...')
    })

    // Try to get this to work once we have mock data

    // it('Get timeline data', () => {
    //     cy.get('[data-cy=timelinedata]').then(($result) => {
    //         console.log($result)
    //     })
    // })

    // it('Should generate no results in timeline', () => {
    //     cy.get('[data-cy=timeline]').click()

    //     cy.wait(5000)

    //     cy.get('.infinite-status-prompt').contains('No results :(')
    // })
})