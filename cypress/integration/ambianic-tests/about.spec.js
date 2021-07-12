/// <reference types="cypress" />
context('AboutPage', () => {
  beforeEach(() => {
    cy.visit('/about')
  })

  it('Loads title and subtitle', () => {
    cy.get('#about-title > .v-list-item__content > .v-list-item__title')
      .should('contain.text', 'Safe Home')

    cy.get('#about-title > .v-list-item__content > .v-list-item__subtitle')
      .should('contain.text', 'via Ambient Intelligence')
  })

  it('Loads timeline button', () => {
    let btn = cy.get('#btn-timeline')
    btn.should('have.attr', 'href', '/timeline')
    btn.get('.v-btn__content')
      .contains('View Timeline', { matchCase: false })
  })

  it('Loads settings button', () => {
    let btn = cy.get('#btn-settings')
    btn.should('have.attr', 'href', '/settings')
    btn.get('.v-btn__content')
      .contains('Settings', { matchCase: false })
  })

  it('Loads version info', () => {
    cy.get('#version-info > .v-list-item__content > .v-list-item__subtitle')
      .should('contain.text', 'Release Version')

      const versionNumber = require('../../../package.json').version
      cy.get('[data-cy=title-text]').should('contain.text', versionNumber )
  })
})
