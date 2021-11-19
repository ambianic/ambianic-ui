/// <reference types="cypress" />
import {
  NEW_REMOTE_PEER_ID,
  REMOTE_PEER_ID_REMOVED,
  PEER_CONNECTED,
  PEER_DISCONNECTED,
  EDGE_API,
  PNP_SERVICE_CONNECTED,
  PNP_SERVICE_DISCONNECTED
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

// a fake remote edge device peer ID
const edgePeerId = '917d5f0a-6469-4d33-b5c2-efd858118b74'

function _fakeConnect (cy, win, options) {
  console.debug('_fakeConnect start')
  // block auto discovery
  win.__store__.state.pnp.peerDiscover = cy.stub()
  // set a fake initial remote peer ID that doesn't exist
  win.__store__.commit(NEW_REMOTE_PEER_ID, edgePeerId)
  // fake edge connected
  win.__store__.commit(PNP_SERVICE_CONNECTED)
  win.__store__.commit(PEER_CONNECTED)
  win.__store__.dispatch('myDevices/setCurrent', edgePeerId)
  // inject a PeerJS mock object
  win.__store__.state.pnp.peer = fakePeer
  // fake cached edge version
  let edgeDetails
  if (!options || !options.edgeDetails) {
    edgeDetails = {
      peerID: edgePeerId,
      version: '1.2.testing',
      display_name: 'Cached Edge Device'
    }
  } else {
    edgeDetails = options.edgeDetails
  }
  win.__store__.dispatch('myDevices/updateFromRemote', edgeDetails)
  // mockup EdgeAPI
  const edgeAPI = cy.stub()
  edgeAPI.getEdgeStatus = cy.stub().callsFake( () => {
    return edgeDetails
  })
  edgeAPI.auth = cy.stub().callsFake( () => {
    return 'Ambianic'
  })
  // fake pnp connect action
  win.__store__.state.pnp.peerConnect = cy.stub()
  win.__store__.commit(EDGE_API, edgeAPI)
  console.debug('_fakeConnect done')
}

context('Settings', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/settings')
    // cy.get('[data-cy=settings]').click()
  })

  afterEach(() => {
    cy.window().then(win => {
      // restore Vuex store state
      win.__store__.commit(REMOTE_PEER_ID_REMOVED)
      win.__store__.commit(PNP_SERVICE_DISCONNECTED)
      win.__store__.commit(PEER_DISCONNECTED)
    })
  })

  it('Should have a title card', () => {
    cy.get('[data-cy=device-card-title]').contains('Select a device')
  })

  it('Should have My Devices button', () => {
    cy.get('[data-cy=mydevices-btn]').contains('My Devices')
  })

  it('Should display edge device peer ID', () => {
    cy.window().then(win => {
      cy.get('[data-cy=list-item-edgePeerID]').should('not.exist').then( ($el) => {
        _fakeConnect(cy, win)
        cy.get('[data-cy=list-item-edgePeerID]').should('exist')
          .find('[data-cy=input-title-sensitive]').should('be.visible')
          .should('have.value', edgePeerId)
      })
    })
  })

  it('Should display sensitive text eye icon next to peer edge ID', () => {
    cy.window().then(win => {
      _fakeConnect(cy, win)
      cy.get('[data-cy=icon-sensitive-on]').should('not.exist')
      // tooltip should not be shown without focus on the icon
      cy.contains('Show/Hide cleartext').should('not.exist')
      cy.get('[data-cy=list-item-edgePeerID]').should('exist')
        .find('[data-cy=icon-sensitive-on]')
        .should('exist')
        // focus on the icon to check if a tooltip is shown
        .focus()
      // check if tooltip is shown for the eye icon
      cy.contains('Show/Hide cleartext')
    })
  })

  it('Should display copy paste icon next to peer edge ID', () => {
    cy.window().then(win => {
      cy.get('[data-cy=icon-copy-on]').should('not.exist').then( ($el) => {
        _fakeConnect(cy, win)
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

  it('DeviceCard Should display skeleton loader for unavailable edge version info', () => {
    cy.window().then(win => {
      // no cached device details
      const edgeDetails = {
        peerID: edgePeerId,
        version: undefined,
        display_name: undefined
      }
      _fakeConnect(cy, win, { edgeDetails })
      cy.get('[data-cy=btn-device-config]').click()
        .get('[data-cy=list-item-edgeVersion]').should('exist').within(($listItem) => {
        // version number should not be available for a non-existant edge device ID
        cy.get('[data-cy=title-loader]').should('exist')
      })
    })
  })

  it('DeviceCard Should display error message for unavailable edge status API', () => {
    cy.window().then(win => {
      const edgeDetails = {
        peerID: edgePeerId,
        version: undefined,
        display_name: undefined
      }
      _fakeConnect(cy, win, { edgeDetails })
      cy.get('[data-cy=btn-device-config]').click()
        .get('[data-cy=list-item-edgeVersion]').should('exist')
        // version number should not be available for a non-existant edge device ID
        .find('[data-cy=title-loader]').should('exist')
      // error banner should show up when remote status API call times out and fails
      cy.get('[data-cy=edge-device-error]')
        .should('exist')
        .contains('Edge device requires update.')
    })
  })

  it('DeviceCard Should display edge version when available', () => {
    cy.window().then(win => {
      const edgeDetails = {
        peerID: edgePeerId,
        version: '1.2.3.test',
        display_name: undefined
      }
      _fakeConnect(cy, win, { edgeDetails })
      cy.get('[data-cy=btn-device-config]').click()
        .get('[data-cy=list-item-edgeVersion]').should('exist').within(($listItem) => {
        cy.get('[data-cy=title-text-read-only]')
          .should('exist')
          .contains('1.2.3.test')
      })
      cy.get('[data-cy=edge-device-error]')
        .should('not.exist')
    })
  })
})
