/// <reference types="cypress" />
import {
  NEW_REMOTE_PEER_ID,
  REMOTE_PEER_ID_REMOVED,
  PEER_CONNECTED,
  PEER_DISCONNECTED,
  EDGE_DEVICE_DETAILS,
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
      // block auto discovery
      win.__store__.state.pnp.peerDiscover = cy.stub()
      // set a fake initial remote peer ID that doesn't exist
      win.__store__.commit(NEW_REMOTE_PEER_ID, edgePeerId)
      // fake edge connected
      win.__store__.commit(PNP_SERVICE_CONNECTED)
      win.__store__.commit(PEER_CONNECTED)    
      // inject a PeerJS mock object
      win.__store__.state.pnp.peer = fakePeer
      // fake cached edge version
      let edgeDetails
      if (!options || !options.edgeDetails) { 
        edgeDetails = {
          version: '1.2.testing',
          display_name: 'Cached Edge Device'
        }
      } else {
        edgeDetails = options.edgeDetails
      }
      win.__store__.commit(EDGE_DEVICE_DETAILS, edgeDetails)      
      // fake peerFetch instance
      const fakePeerFetch = cy.stub()
      fakePeerFetch.request = cy.stub().callsFake( (config) => {
        if (config.url.endsWith('status')) {
          return {
            content: {
              status: 'OK',
              version: '1.3.testing',
              display_name: 'Kitchen Monitor'
            }
          }
        }
      })
      fakePeerFetch.jsonify = cy.stub().callsFake( (data) => data )
      // fake pnp connect action
      win.__store__.state.pnp.peerConnect = cy.stub()
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
      win.__store__.commit(EDGE_DEVICE_DETAILS, undefined)
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

  it('Should display skeleton loader for unavailable edge version info', () => {
    cy.window().then(win => {
      // no cached device details
      const edgeDetails = {
        version: undefined,
        display_name: undefined
      }
      _fakeConnect(cy, win, { edgeDetails })
      cy.get('[data-cy=list-item-edgeVersion]').should('exist').within(($listItem) => {
        // version number should not be available for a non-existant edge device ID
        cy.get('[data-cy=title-loader]').should('exist')
      })
    })
  })

  it('Should display error message for unavailable edge status API', () => {
    cy.window().then(win => {
      const edgeDetails = {
        version: undefined,
        display_name: undefined
      }      
      _fakeConnect(cy, win, { edgeDetails })
      cy.get('[data-cy=list-item-edgeVersion]').should('exist')
        // version number should not be available for a non-existant edge device ID
        .find('[data-cy=title-loader]').should('exist')
      // error banner should show up when remote status API call times out and fails
      cy.get('[data-cy=edge-device-error]')
        .should('exist')
        .contains('Edge device API offline or unreachable.')
    })
  })

  it('Should display edge version when available', () => {
    cy.window().then(win => {
      const edgeDetails = {
        version: '1.2.3.test',
        display_name: undefined
      }      
      _fakeConnect(cy, win, { edgeDetails })
      cy.get('[data-cy=list-item-edgeVersion]').should('exist').within(($listItem) => {
        cy.get('[data-cy=title-text-read-only]')
          .should('exist')
          .contains('1.2.3.test')
      })
      cy.get('[data-cy=edge-device-error]')
        .should('not.exist')
    })
  })
})
