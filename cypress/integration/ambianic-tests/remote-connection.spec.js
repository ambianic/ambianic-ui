/// <reference types="cypress" />
import {
    PEER_CONNECTED,
    PNP_SERVICE_CONNECTED,
    EDGE_API,
    NEW_REMOTE_PEER_ID
  } from '../../../src/store/mutation-types'

// fake PeerJS class
const fakePeer = {
  id: 'browserPeerID',
  open: true,
  options: {
    secure: true,
    host: 'mockhost',
    port: 1212,
    path: '/',
    token: 'mocktocken',
    key: 'mockkey'
  },
  on (event, fn) {},
  connect () {
    const peerConnection = {
      on (event, fn) {}
    }
    return peerConnection
  },
  reconnect () {}
}

context('RemoteConnections',    () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/settings')
    })

    afterEach(() => {
        // cypress automatically clears cookies and local storage after each test
    })

    it('Should discover and display local device', () => {
      cy.window().then(win => {
        // mock auto discovery
        win.__store__.state.pnp.peerDiscover = cy.stub()
        // fake signaling server connection
        win.__store__.commit(PNP_SERVICE_CONNECTED)
        const remotePeerID = '917d5f0a-6469-4d33-b5c2-efd858118b74'
        // inject a PeerJS mock object
        win.__store__.state.pnp.peer = fakePeer
        // mockup EdgeAPI
        const edgeAPI = cy.stub()
        edgeAPI.getEdgeStatus = cy.stub().callsFake( () => {
          return {
            status: 'OK',
            version: '1.5.testing',
            display_name: 'Living Room Monitor'
          }
        })
        edgeAPI.auth = cy.stub().callsFake( () => {
          return 'Ambianic'
        })
        // fake pnp connect action
        win.__store__.state.pnp.peerConnect = cy.stub()
        // setup fetch() interception
        cy.intercept('**/room/id*', (req) => {
          req.reply({
            roomId: '1'
          })
        })
        cy.intercept('**/room/1/join*', (req) => {
          req.reply({ clientsIds: [remotePeerID] })
        })
        cy.intercept('/room/*/members', (req) => {
          req.reply([remotePeerID])
        })
        cy.get('[data-cy=mydevices-btn]').click()
          .get('[data-cy=btn-add-device]').click()
          .get('[data-cy=btn-confirm-add-device]').click()
          .get('[data-cy=btn-local]').click()
          .get('[data-cy=btn-connect-discovered]').click()
          .then( ($vp) => {
              // fake edge connected
              win.__store__.commit(EDGE_API, edgeAPI)
              win.__store__.commit(NEW_REMOTE_PEER_ID, remotePeerID)
              win.__store__.dispatch('myDevices/setCurrent', remotePeerID)
              win.__store__.commit(PEER_CONNECTED)
              cy.get('[data-cy=title-success')
              .should('be.visible')
              .get('[data-cy=btn-settings]').click()
              .get('[data-cy=list-item-edgePeerID')
              .should('be.visible')
              .find('[data-cy=input-title-sensitive]').should('be.visible')
              .get('[data-cy=list-item-edgePeerID')
              .find('[data-cy=icon-sensitive-on]').should('be.visible')
              .click()
              .get('[data-cy=list-item-edgePeerID')
              .find('[data-cy=input-title-sensitive]').should('be.visible')
              .should('have.value', remotePeerID)
              .get('[data-cy=list-item-edgeVersion]').should('be.visible')
              .find('[data-cy=title-text-read-only]').should('be.visible')
              .contains('1.5.testing')
              .get('[data-cy=list-item-edgeDeviceName]').should('be.visible')
              .find('[data-cy=title-text-read-only]').should('be.visible')
              .contains('Living Room Monitor')
          })
      })
    })

    it('Should retrieve and display user PeerID', () => {
      cy.window().then(win => {
        // block auto discovery
        win.__store__.state.pnp.peerDiscover = cy.stub()
        // fake signaling server connection
        win.__store__.commit(PNP_SERVICE_CONNECTED)
        const remotePeerID = '917d5f0a-6469-4d33-b5c2-efd858118b74'
        // inject a PeerJS mock object
        win.__store__.state.pnp.peer = fakePeer
        // fake cached edge version
        // mockup EdgeAPI
        const edgeAPI = cy.stub()
        edgeAPI.getEdgeStatus = cy.stub().callsFake( () => {
          return {
            status: 'OK',
            version: '1.4.testing',
            display_name: 'Stairs Monitor'
          }
        })
        edgeAPI.auth = cy.stub().callsFake( () => {
          return 'Ambianic'
        })
        // fake pnp connect action
        win.__store__.state.pnp.peerConnect = cy.stub()
        cy.get('[data-cy=mydevices-btn]').click()
          .get('[data-cy=btn-add-device]').click()
          .get('[data-cy=btn-confirm-add-device]').click()
          .get('[data-cy=btn-remote]').click()
          .get('[data-cy=input-remotePeerID]').clear()
          .type(remotePeerID)
              .get('[data-cy=btn-connect-remote]').click()
              .then( ($vp) => {
                  // fake edge connected
                  win.__store__.commit(EDGE_API, edgeAPI)
                  win.__store__.commit(PEER_CONNECTED)
                  cy.get('[data-cy=title-success')
                    .should('be.visible')
                    .get('[data-cy=btn-settings]').click()
                    .get('[data-cy=list-item-edgePeerID')
                    .find('[data-cy=input-title-sensitive]').should('be.visible')
                    .get('[data-cy=list-item-edgePeerID')
                    .find('[data-cy=icon-sensitive-on]').should('be.visible')
                    .click()
                    .get('[data-cy=list-item-edgePeerID')
                    .find('[data-cy=input-title-sensitive]').should('be.visible')
                    .should('have.value', remotePeerID)
                    .get('[data-cy=list-item-edgeVersion]').should('be.visible')
                    .find('[data-cy=title-text-read-only]').should('be.visible')
                    .contains('1.4.testing')
                    .get('[data-cy=list-item-edgeDeviceName]').should('be.visible')
                    .find('[data-cy=title-text-read-only]').should('be.visible')
                    .contains('Stairs Monitor')
              })
        })
    })
})
