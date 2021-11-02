/// <reference types="cypress" />
context('AboutPage', () => {
  beforeEach(() => {
    cy.visit('/about')
  })

  it('Loads logo', () => {
      cy.get('[data-cy=logo-image]').should('exist')
  })

  it('Loads title and subtitle', () => {
    cy.get('#about-title > .v-list-item__content > .v-list-item__subtitle')
      .should('contain.text', 'Safer Home')

    cy.get('#about-title > .v-list-item__content > .v-list-item__subtitle')
      .should('contain.text', 'Privacy Preserving. Decentralized.')
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
    cy.get('[data-cy=version-info]')
      .should('contain.text', 'UI App Version')

      const versionNumber = require('../../../package.json').version
      cy.get('[data-cy=title-text-read-only]').should('contain.text', versionNumber )
  })
})
