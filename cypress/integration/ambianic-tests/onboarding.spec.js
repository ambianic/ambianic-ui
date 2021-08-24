/// <reference types="cypress" />

context('Onboarding', () => {
  before(() => {
    cy.visit('http://localhost:8080/onboarding')
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

    cy.get('[data-cy=continue-installation]').click()
  })

  it('It shows App Already Installed message when PWA beforeinstallprompt does not fire', () => {
    cy.reload().window().then((win) => {
      // intercept addEventListener to emulate browsers
      // that do not support beforeinstallprompt
      const nativeaddEventListener = win.addEventListener
      cy.stub(win, 'addEventListener', (eventName, callback) => {
        if (eventName !== 'beforeinstallprompt') {
          return nativeaddEventListener(eventName, callback)
        }
      })

      cy.get('[data-cy=install-app]').click()
      cy.get('[data-cy=continue-installation]').click()
      cy.get('[data-cy=label-installOutcomeMessage]').should('be.visible').within(($listItem) => {
        cy.contains('App already installed or browser does not support PWA install.')
          .should('be.visible')
      })
    })
  })

  it.only('It shows affirmative install message when PWA beforeinstallprompt fires', () => {
    cy.window().then((win) => {
      // wait until the page has rendered and event callbacks have been registered
      cy.get('[data-cy=install-app]')
      // emulate PWA install enabled browser that doesn't have Ambianic UI installed
      // by firing beforeinstallprompt
      const event = new Event('beforeinstallprompt')
      win.dispatchEvent(event)
      cy.get('[data-cy=install-app]')
        .click()
        .get('[data-cy=continue-installation]')
        .click()
        .get('[data-cy=label-installOutcomeMessage]')
        .should('be.visible')
        .within(($listItem) => {
          cy.contains('Ambianic can be now accesssed as a native home screen app on this device.')
            .should('be.visible')
        })
    })
  })

  it('It confirms remote request message and request grant', () => {
    cy.get('[data-cy=continue-step-2]').click()
    cy.get('[data-cy=remote-button]').click()
    cy.get('[data-cy=request-access]').click()

    cy.get('[data-cy=send-message]').click()
    cy.get('[data-cy=select-client]').click('')
  })

  it('Should have PeerID input field and enabled Submit button after validation', () => {
    cy.get('input[name="peerid-input"]').type(
      '917d5f0a-6469-4d33-b5c2-efd858118b74'
    )
    cy.get('[data-cy=submit-button]').should('be.enabled')
  })
})
