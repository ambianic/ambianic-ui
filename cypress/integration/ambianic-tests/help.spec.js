/// <reference types="cypress" />
context('HelpPage', () => {
  beforeEach(() => {
    cy.visit('/help')
  })

  it('Look at page title and subtitle', () => {
    cy.get('[data-cy=help-title]')
      .contains('Need Help with Ambianic?', { matchCase: false })

    cy.get('[data-cy=help-text]')
      .contains('Please reference our online docs', { matchCase: false })
  })

  it('Check docs button', () => {
    cy.get('[data-cy=btn-docs]')
      .should('have.attr', 'href', 'https://docs.ambianic.ai')
      .get('.v-btn__content')
      .contains('Documentation', { matchCase: false })
  })

  it('Check forum button', () => {
    cy.get('[data-cy=btn-forum]')
      .should('have.attr', 'href', 'https://github.com/ambianic/ambianic-ui/discussions')
      .get('.v-btn__content')
      .contains('Forum', { matchCase: false })
  })

  it('Check community button', () => {
    cy.get('[data-cy=btn-community]')
      .should('have.attr', 'href', 'https://join.slack.com/t/ambianicai/shared_invite/zt-eosk4tv5-~GR3Sm7ccGbv1R7IEpk7OQ')
      .get('.v-btn__content')
      .contains('Slack', { matchCase: false })
  })
})
