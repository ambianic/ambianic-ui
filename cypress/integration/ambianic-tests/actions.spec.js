/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Looks at app <title> tag', () => {
    cy.title().should('eq', 'Ambianic UI')
  })

  it('looks inside <meta> tag for description', () => {
    cy.get('head meta[name="description"]')
      .should('have.attr', 'content', 'Ambianic UI progressive web application to manage Ambianic Edge devices')
  })

  it('looks inside welcome message', () => {
    cy.get('#welcome-text')
      .should('contain', 'home timeline')
  })

  it('looks at settings button', () => {
    let btn = cy.get('#btn-settings')
    btn.should('have.attr', 'href', '/settings')
    btn.get('.v-btn__content')
      .contains('settings', { matchCase: false })
  })

  it('looks at timeline button', () => {
    let btn = cy.get('#btn-timeline')
    btn.should('have.attr', 'href', '/timeline')
    btn.get('.v-btn__content')
      .contains('view timeline', { matchCase: false })
  })

})
