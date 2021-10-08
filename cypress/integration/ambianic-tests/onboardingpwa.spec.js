/// <reference types="cypress" />

context('Onboarding Wizard', () => {
  beforeEach(() => {
    cy.visit('/onboarding', {
      onBeforeLoad (win) {
        cy.spy(win, 'addEventListener').as('addEventListener')
      }
    })
    // make sure Vue app is mounted
    cy.window().should('have.property', '__VueApp__')
  })

  it('It shows App Already Installed message when PWA beforeinstallprompt does not fire', () => {
    cy.visit('/onboarding', {
      onBeforeLoad (win) {
        // intercept addEventListener to emulate browsers
        // that do not support beforeinstallprompt
        cy.stub(win, 'addEventListener').withArgs('beforeinstallprompt', Cypress.sinon.match.any).returns(true)
      }
    }).window().then((win) => {
      cy.get('[data-cy=install-app]').click()
        .get('[data-cy=continue-to-edge-installation]').click()
        .get('[data-cy=label-pwaInstallOutcomeMessage]').should('be.visible').within(($listItem) => {
          cy.contains('App already installed or browser does not support PWA install.')
            .should('be.visible')
        }).then(() => {
          expect(win.addEventListener).to.be.calledWith('beforeinstallprompt')
        })
    })
  })

  it('Handles browser PWA beforeinstallprompt event', () => {
    // cy.get('[data-cy=install-app]').should('be.visible')
    cy.window().then((win) => {
      cy.get('[data-cy=install-app]').should('be.visible').then(() => {
        expect(win.addEventListener).to.be.calledWith('beforeinstallprompt')
         // emulate PWA install enabled browser that doesn't have Ambianic UI installed
         // by firing beforeinstallprompt
        const pwaInstallEvent = new Event('beforeinstallprompt')
        pwaInstallEvent.prompt = cy.stub()
        win.dispatchEvent(pwaInstallEvent)
         // emulate user choice: confirm PWA install
        pwaInstallEvent.userChoice = new Promise((resolve, reject) => {
          return resolve({ outcome: 'accepted' })
        })

        cy.get('[data-cy=install-app]')
          .click()
          .get('[data-cy=label-pwaInstallOutcomeMessage]')
          .should('be.visible')
          .within(($listItem) => {
            /*
            UPDATE: Changed assertion text due to execution flow.
            From `onboarding-wizard.js`, 'Ambianic can be now accessed as a native home screen app on this device.'
            should be displayed when `outcome === accepted`
             */
            cy.contains('Ambianic can be now accessed as a native home screen app on this device.')
              .should('be.visible')
          })
      })
    })
  })

  it('It shows affirmative install message when PWA beforeinstallprompt fires and user confirms', () => {
    cy.window().then((win) => {
      cy.get('[data-cy=install-app]').should('be.visible').then(() => {
        // emulate PWA install enabled browser that doesn't have Ambianic UI installed
        // by firing beforeinstallprompt
        const pwaInstallEvent = new Event('beforeinstallprompt')
        pwaInstallEvent.prompt = cy.stub()
        win.dispatchEvent(pwaInstallEvent)
        // emulate user choice: confirm PWA install
        pwaInstallEvent.userChoice = new Promise((resolve, reject) => {
          return resolve({ outcome: 'accepted' })
        })
        win.dispatchEvent(pwaInstallEvent)
        cy.get('[data-cy=install-app]')
          .click()
          .get('[data-cy=label-pwaInstallOutcomeMessage]')
          .should('be.visible')
          .within(($listItem) => {
            cy.contains('Ambianic can be now accessed as a native home screen app on this device.')
              .should('be.visible')
          })
      })
    })
  })

  it('It skips install step when PWA beforeinstallprompt fires and user cancels', () => {
    cy.window().then((win) => {
      cy.get('[data-cy=install-app]').should('be.visible').then(() => {
        // emulate PWA install enabled browser that doesn't have Ambianic UI installed
        // by firing beforeinstallprompt
        const pwaInstallEvent = new Event('beforeinstallprompt')
        pwaInstallEvent.prompt = cy.stub()
        // emulate user choice: confirm PWA install
        pwaInstallEvent.userChoice = new Promise((resolve, reject) => {
          return resolve({ outcome: 'dismissed' })
        })
        win.dispatchEvent(pwaInstallEvent)
        cy.get('[data-cy=install-app]')
          .click()
          .get('[data-cy=continue-to-edge-installation]')
          .should('not.exist')
          .get('[data-cy=label-pwaInstallOutcomeMessage]')
          .should('not.exist')
          .get('[data-cy=continue-to-step-edge-installation-question]')
          .should('be.visible')
          .within(($listItem) => {
            cy.contains('setup your Ambianic Edge device')
              .should('be.visible')
          })
      })
    })
  })

  it('It shows error message if PWA beforeinstallprompt fires but installprompt fails', () => {
    cy.window().then((win) => {
      // wait until the page has rendered and event callbacks have been registered
      cy.get('[data-cy=install-app]').should('be.visible').then(() => {
        // emulate PWA install enabled browser that doesn't have Ambianic UI installed
        // by firing beforeinstallprompt
        const pwaInstallEvent = new Event('beforeinstallprompt')
        // emulate an exception during installprompt handling
        pwaInstallEvent.prompt = cy.stub().throws()
        // emulate user choice: confirm PWA install
        pwaInstallEvent.userChoice = new Promise((resolve, reject) => {
          return resolve('This line should not be reached during this test.')
        })
        win.dispatchEvent(pwaInstallEvent)
        cy.get('[data-cy=install-app]')
          .click()
          .get('[data-cy=continue-to-edge-installation]')
          .should('be.visible')
          .get('[data-cy=label-pwaInstallOutcomeMessage]')
          .should('be.visible')
          .within(($listItem) => {
            cy.contains('Error during app install')
              .should('be.visible')
          })
      })
    })
  })
})
