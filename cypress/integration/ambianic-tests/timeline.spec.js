/// <reference types="cypress" />

context('Timeline', () => {
  before(() => {
    cy.visit('http://localhost:8080')
    //   cy.get('[data-cy=timeline]').click()
    cy.visit('./timeline')
  })

  it('Should browse to timeline', () => {
    cy.url().should('include', '/timeline')
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
