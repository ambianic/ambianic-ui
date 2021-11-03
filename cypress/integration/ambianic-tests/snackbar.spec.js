/// <reference types="cypress" />
import {
    NEW_REMOTE_PEER_ID,
    PEER_CONNECTING,
    PEER_CONNECTED,
    PEER_DISCONNECTED,
    PNP_SERVICE_CONNECTED,
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
    // set a fake initial remote peer ID that doesn't exist
    win.__store__.commit(NEW_REMOTE_PEER_ID, edgePeerId)
    // fake edge connected
    win.__store__.commit(PNP_SERVICE_CONNECTED)
    win.__store__.dispatch('myDevices/setCurrent', edgePeerId)
    // inject a PeerJS mock object
    win.__store__.state.pnp.peer = fakePeer
}


context('RemoteConnections',    () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/timeline')
    })

     it('Displays snackbar when page loads', () => {
        cy.window().then(win => {
            _fakeConnect(cy, win)
            win.__store__.commit(PEER_DISCONNECTED)
            win.__store__.commit(PEER_CONNECTING)
            cy.get('[data-cy=snackbar]').find('#snack-message')
                .contains('Connecting to Ambianic Edge device').then ( (context) => {
                    win.__store__.commit(PEER_CONNECTED)
                    cy.get('[data-cy=snackbar]').find('#snack-message')
                        .contains('Connected to Ambianic Edge device').then ( (context) => {
                            win.__store__.commit(PEER_DISCONNECTED)
                            cy.get('[data-cy=snackbar]')
                                .contains('Disconnected from Ambianic Edge device')
                        })
                })
        })
    })
})
