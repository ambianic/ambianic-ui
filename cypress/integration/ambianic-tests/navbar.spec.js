/// <reference types="cypress" />

context('Check Navbar Items', () => {
  before(() => {
    cy.visit('http://localhost:8080')
    cy.get('[data-cy=timeline]').click()
  })

  it('Should have a search bar', () => {
    cy.get('[data-cy=container').find('#searchbar')
  })

  it('Should be a download off button', () => {
    const t = cy.get('[data-cy=download-off]')
    expect(t).to.exist
  })

  it('Should be a heart button', () => {
    const t = cy.get('[data-cy=heart]')
    expect(t).to.exist
  })

  it('Should be a bell button', () => {
    const t = cy.get('[data-cy=bell]')
    expect(t).to.exist
  })

  it('Should have user profile component card', () => {
    cy.get('[data-cy=display-profile]').click()
    cy.get('[data-cy=profile-toggle]').click()
  })

  it('Should have a five links', () => {
    cy.get('[data-cy=drawer]').then(($result) => {
      assert.equal($result.children().children()[0].childElementCount, 5, 'Five links in the drawer')
    })
  })

  it('Should have a clickable timeline icon', () => {
    const icon =  cy.get('[data-cy=timeline-icon]')
    
    icon.should("be.visible")

    icon.click()

    cy.url().should('include', '/timeline')
  })
})