/// <reference types="cypress" />
import { NEW_REMOTE_PEER_ID, REMOTE_PEER_ID_REMOVED } from '../../../src/store/mutation-types'

context('Settings', () => {
  before(() => {
    cy.visit('http://localhost:8080/settings')
    // cy.get('[data-cy=settings]').click()
  })

  afterEach(() => {
    cy.window().then(win => {
      // restore Vuex store state
      win.__store__.commit(REMOTE_PEER_ID_REMOVED)
    })
  })

  it('Should have a title card', () => {
    cy.get('[data-cy=titlecard]').contains('Ambianic Edge connection details')
  })

  it('Should have a local ambianic edge title card', () => {
    cy.get('[data-cy=localtitlecard]').contains('Pair with local Ambianic Edge device')
  })

  it('Should have a remote ambianic edge title card', () => {
    cy.get('[data-cy=remotetitlecard]').contains('Pair with remote Ambianic Edge device')
  })

  it('Should have remote connection button disabled', () => {
    cy.get('[data-cy=sendRemotePeerID]').should('be.disabled')
  })

  it('Should have remote connection button enabled', () => {  
    cy.get('[data-cy=remotePeerID]').type('917d5f0a-6469-4d33-b5c2-efd858118b74')
    cy.get('[data-cy=sendRemotePeerID]').should('be.enabled')
  })

  it('Should have a row', () => {
    cy.get('[data-cy=template-row]').should('exist')
  })

  it('Should display edge device peer ID', () => {
    var edgePeerId = '917d5f0a-6469-4d33-b5c2-efd858118b74'
    cy.window().then(win => {
      cy.get('[data-cy=list-item-edgePeerID]').should('not.exist')
      win.__store__.commit(NEW_REMOTE_PEER_ID, edgePeerId)
      cy.get('[data-cy=list-item-edgePeerID]').should('exist').within(($listItem) => {
        cy.get('[data-cy=input-title]').get('input').should('have.value', edgePeerId)
      })
    })
  })

  it('Should display sensitive text eye icon next to peer edge ID', () => {
    cy.window().then(win => {
      cy.get('[data-cy=icon-sensitive-on]').should('not.exist')
      win.__store__.commit(NEW_REMOTE_PEER_ID, '917d5f0a-6469-4d33-b5c2-efd858118b74')
      // tooltip should not be shown without focus on the icon
      cy.contains('Show/Hide cleartext').should('not.exist')
      cy.get('[data-cy=list-item-edgePeerID]').should('exist').within(($listItem) => {
        cy.get('[data-cy=icon-sensitive-on]')
          .should('exist')
          // focus on the icon to check if a tooltip is shown
          .focus()
      })
      // check if tooltip is shown for the eye icon
      cy.contains('Show/Hide cleartext')
    })
  })

  it('Should display copy paste icon next to peer edge ID', () => {
    cy.window().then(win => {
      cy.get('[data-cy=icon-copy-on]').should('not.exist')
      win.__store__.commit(NEW_REMOTE_PEER_ID, '917d5f0a-6469-4d33-b5c2-efd858118b74')
      // tooltip should not be shown without focus on the icon
      cy.contains('Copy to clipboard').should('not.exist')
      cy.get('[data-cy=list-item-edgePeerID]').should('exist').within(($listItem) => {
        cy.get('[data-cy=icon-copy-on]')
          .should('exist')
          // focus on the icon to check if a tooltip is shown
          .focus()
      })
      // check if tooltip is shown for the eye icon
      cy.contains('Copy to clipboard')
    })
  })
})
