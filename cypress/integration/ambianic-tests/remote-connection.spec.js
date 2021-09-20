/// <reference types="cypress" />
import {
    PEER_CONNECTED,
    EDGE_DEVICE_DETAILS,
    PNP_SERVICE_CONNECTED,
    PEER_FETCH,
    NEW_REMOTE_PEER_ID
  } from '../../../src/store/mutation-types'

  // fake PeerJS class
  const fakePeer = {
    open: true,
    on (event, fn) {},
    connect () {
      const peerConnection = {
        on (event, fn) {}
      }
      return peerConnection
    },
    reconnect () {}
  }
  
const checkViewPort = (cy, device) => {
  cy.viewport(device).window().then(win => {
      // block auto discovery
      win.__store__.state.pnp.peerDiscover = cy.stub()
      // set a fake initial remote peer ID that doesn't exist
      win.__store__.commit(NEW_REMOTE_PEER_ID, '917d5f0a-6469-4d33-b5c2-efd85811NA')
      // fake edge connected
      win.__store__.commit(PNP_SERVICE_CONNECTED)
      win.__store__.commit(PEER_CONNECTED)    
      const remotePeerID = '917d5f0a-6469-4d33-b5c2-efd858118b74'
      // inject a PeerJS mock object
      win.__store__.state.pnp.peer = fakePeer
      // fake cached edge version
      const details = {
        version: '1.2.testing',
        display_name: 'Cached Edge Device'
      }
      win.__store__.commit(EDGE_DEVICE_DETAILS, details)      
      // fake peerFetch instance
      const fakePeerFetch = cy.stub()
      fakePeerFetch.request = cy.stub().callsFake( (config) => {
        //if (url.match(/status$/)) {
          return {
            content: {
              status: 'OK',
              version: '1.3.testing',
              display_name: 'Kitchen Monitor'
            }
          }
        //}
      })
      fakePeerFetch.jsonify = cy.stub().callsFake( (data) => data )
      // fake pnp connect action
      win.__store__.state.pnp.peerConnect = cy.stub()
      cy.get('[data-cy=list-item-edgeVersion]').should('be.visible')
        .find('[data-cy=title-text-read-only]').should('be.visible')
        .contains('1.2.testing')
        .get('[data-cy=list-item-edgeDeviceName]').should('be.visible')
        .find('[data-cy=title-text-read-only]').should('be.visible')
        .contains('Cached Edge Device')
        .get('[data-cy=remotePeerID]').clear().type(remotePeerID)
        .get('[data-cy=sendRemotePeerID]').click()
        .then( ($vp) => {
          cy.get('[data-cy=edge-device-disconnected]').then( ($el) => {
            // fake edge connected
            win.__store__.commit(PEER_FETCH, fakePeerFetch)
            win.__store__.commit(PNP_SERVICE_CONNECTED)
            win.__store__.commit(PEER_CONNECTED)    
            cy.get('[data-cy=list-item-edgePeerID').should('be.visible').
                find('[data-cy=icon-sensitive-on]').should('be.visible')
                .click()
                .get('[data-cy=input-title-sensitive]').should('be.visible')
                .should('have.value', remotePeerID)
                .get('[data-cy=list-item-edgeVersion]').should('be.visible')
                .find('[data-cy=title-text-read-only]').should('be.visible')
                .contains('1.3.testing')
                .get('[data-cy=list-item-edgeDeviceName]').should('be.visible')
                .find('[data-cy=title-text-read-only]').should('be.visible')
                .contains('Kitchen Monitor')
          })
        })
  })
}

context('RemoteConnections',    () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/settings')
    })

    afterEach(() => {
        // cypress automatically clears cookies and local storage after each test
    })

    // NOTE: this test commented out because it depends on an external edge server
    // it should be activated again when the CI is setup to run a localhost edge.
    // it('Should be connected automatically', () => {
    //     cy.get('#btn-settings').click()
    //     cy.wait(8000)
    //     cy.get('#peerID').contains('5568ec87-42d8-47b0-aeea-01a125db0623')
    // })

    /**
    
    This test also relies on an actual remote peer connection being established before it can verify that the input display value is hidden.
    Needs to be fixed. See https://github.com/ambianic/ambianic-ui/issues/595
    
    it('Should retrieve and display user PeerID', () => {
        // cy.get('#btn-settings').click()
        cy.get('#remotePeerID').type('917d5f0a-6469-4d33-b5c2-efd858118b74')
        cy.get('#btn-sendRemotePeerID').click()

        // makes sure ID is hidden by default
        cy.get('input').should('not.have.value', '917d5f0a-6469-4d33-b5c2-efd858118b74')
        // reveal hidden PeerID
        cy.get('#toggle-visibility').click()
        cy.get('#peerId-container').should('have.value', '917d5f0a-6469-4d33-b5c2-efd858118b74')
    })
    */

    //Set an array of sizes
    const sizes = ['iphone-5', 'iphone-6', 'samsung-s10', 'samsung-note9', 'iphone-x', 'iphone-xr',
      'ipad-mini', 'ipad-2', 'macbook-11', 'macbook-13', 'macbook-16'
    ];

    describe('Find page elements correctly in a range of browser device viewports', () => {

      sizes.forEach(size => {
        it(`Should display elements correctly on ${size}`, () => {
          // ensure elements are shown on smaller viewports
          checkViewPort(cy, size)
        })
      })
    })
})
