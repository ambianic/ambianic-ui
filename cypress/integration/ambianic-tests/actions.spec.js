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
      .should('contain', "Let's setup your system" )
  })
 
  it('looks at welcome button', () => {
    let btn = cy.get('#btn-timeline')
    btn.get('.v-btn__content')
      .contains('Continue Setup', { matchCase: false })
  })
})
