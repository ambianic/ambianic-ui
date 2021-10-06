/// <reference types="cypress" />

const TEST_REMOTE_PEER_ID = '917d5f0a-6469-4d33-b5c2-efd858118b74'

context('Onboarding Wizard', () => {
  before(() => {
    cy.visit('/onboarding')
  })

  it('Should have a splashscreen installation card', () => {
    cy.get('[data-cy=installationCard]')
  })

  it('Should have a messaging option modal', () => {
    cy.get('[data-cy=messaging-option-modal]')
  })

  it('Should have three installation steps', () => {
    cy.get('[data-cy=stepper]').should('have.length', 3)
  })

  it('It executes first installation step and installs App', () => {
    cy.get('[data-cy=install-app]').click()

    cy.get('[data-cy=continue-to-edge-installation]').click()
  })

  it('It accepts input of an existing remote peer ID', () => {
    cy.get('[data-cy=button-continue-to-step-edge-installation-question]').click()
    cy.get('[data-cy=remote-button]').click()

    cy.get('#click-text').click()

    expect(cy.get('[data-cy=submit-existing-remotePeerID]')).to.exist
    expect(cy.get('[data-cy=existingRemotePeerID-input]')).to.exist
    cy.get('[data-cy=existingRemotePeerID-input]').type(TEST_REMOTE_PEER_ID)
    cy.get('[data-cy=submit-existing-remotePeerID]').should('not.be.disabled')
    cy.get('[data-cy=cancel-input-existing-remoteID]').click()
  })

  it('It confirms remote request message and request grant', () => {

    cy.get('[data-cy=request-access]').click()

    cy.get('[data-cy=send-message]').click()

    cy.get('.messaging-client').each((item, index, element) => {
      element[1].click()
    })
  })

  it('Should have PeerID input field and enabled Submit button after validation', () => {
    cy.get('input[name="peerid-input"]').type(TEST_REMOTE_PEER_ID)
    cy.get('[data-cy=submit-button]').should('be.enabled')
  })
})
