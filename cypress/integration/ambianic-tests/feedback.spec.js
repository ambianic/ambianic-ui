/// <reference types="cypress" />
context('FeedbackPage', () => {
  beforeEach(() => {
    cy.visit('/feedback')
  })

  it('Look at page title and subtitle', () => {
    cy.get('[data-cy=feedback-title]')
      .contains('Send Feedback', { matchCase: false })

    cy.get('[data-cy=feedback-text]')
      .contains('Your feedback helps us focus.', { matchCase: false })
  })

  it('Check feedback button', () => {
    cy.get('[data-cy=btn-feedback]')
      .should('have.attr', 'href', 'https://github.com/ambianic/ambianic-ui/discussions/categories/feedback')
      .get('.v-btn__content')
      .contains('Feedback Forum', { matchCase: false })
  })
})
