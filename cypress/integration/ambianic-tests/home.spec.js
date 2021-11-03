/// <reference types="cypress" />
import { CHANGE_REMOTE_PEER_ID } from '../../../src/store/action-types';

context('HomePage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Loads title and subtitle', () => {
    cy.get('[data-cy=subtitle-one]')
      .should('contain.text', 'Safer Home via Ambient Intelligence.')

    cy.get('[data-cy=subtitle-two]')
      .should('contain.text', 'Privacy Preserving. Decentralized.')
  })

  it('looks at continue button', () => {
    cy.get('[data-cy=btn-continue]')
      .get('.v-btn__content')
      .contains('Continue', { matchCase: false })
  })
})
