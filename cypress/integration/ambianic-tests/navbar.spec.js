/// <reference types="cypress" />

context('Check Navbar Items', () => {
  before(() => {
    cy.visit('http://localhost:8080/about')
  })

  it('Should display a connection-offline icon before edge connection', () => {
    cy.get('[data-cy=connection-status]')
      .should('exist')
      .should('be.visible').click()
      cy.url().should('include', '/settings')
  })

  /** future buttons
  it('Should not have a search bar', () => {
      cy.get('[data-cy=container').find("#searchbar")
  })

  it('Should not have a heart button', () => {
    const t = cy.get('[data-cy=heart]')
    expect(t).to.exist
  })

  it('Should be a bell button', () => {
    const t = cy.get('[data-cy=bell]')
    expect(t).to.exist
  })
   */

  it('Should be an about button', () => {
    cy.get('[data-cy=about]').should('exist')
  })

  it('Should have a five links', () => {
    cy.get('[data-cy=drawer]').then(($result) => { 
      assert.equal($result.children().children()[0].childElementCount,5,'Five links in the drawer')
    })
  })

  it('Should have a clickable timeline icon', () => {
    cy.get('[data-cy=timeline-icon]').should('be.visible').click()
    cy.url().should('include', '/timeline')
  })
})
