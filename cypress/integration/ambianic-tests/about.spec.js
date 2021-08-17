/// <reference types="cypress" />
context('AboutPage', () => {
  beforeEach(() => {
    cy.visit('/about')
  })

  it('Loads title and subtitle', () => {
    cy.get('#about-title > .v-list-item__content > .v-list-item__title')
      .should('contain.text', 'Safer Home')

    cy.get('#about-title > .v-list-item__content > .v-list-item__subtitle')
      .should('contain.text', 'via Ambient Intelligence')
  })

  it('Loads timeline button', () => {
    cy.get('#btn-timeline')
      .should('have.attr', 'href', '/timeline')
      .get('.v-btn__content')
      .contains('View Timeline', { matchCase: false })
  })

  it('Loads settings button', () => {
    cy.get('#btn-settings')
      .should('have.attr', 'href', '/settings')
      .get('.v-btn__content')
      .contains('Settings', { matchCase: false })
  })

  it('Loads version info', () => {
    cy.get('#version-info > .v-list-item__content > .v-list-item__subtitle')
      .should('contain.text', 'UI App Version')

      const versionNumber = require('../../../package.json').version
      cy.get('[data-cy=title-text]').should('contain.text', versionNumber )
  })
})
