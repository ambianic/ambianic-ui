/// <reference types="cypress" />
context('FeedbackPage', () => {
  beforeEach(() => {
    cy.visit('/feedback')
  })


  it('Look at page title and subtitle', () => {

    cy.get('#feedback-title > .v-list-item__content > .v-list-item__title')
      .contains('Send Feedback', { matchCase: false })

    cy.get('#feedback-title > .v-list-item__content > .v-list-item__subtitle')
      .contains('We currently use github to gather user feedbaack', { matchCase: false })
  })

  it('Check feedback button', () => {
    let btn = cy.get('#btn-feedback')
    btn.should('have.attr', 'href', 'https://github.com/ambianic/ambianic-ui/issues')
    btn.get('.v-btn__content')
      .contains('Open Feedback Page', { matchCase: false })
  })

})
