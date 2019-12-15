/**
  Manage plug and play connection status to Ambianic Edge.
*/
import Peer from 'peerjs'
import {
  PEER_DISCONNECTED,
  PEER_CONNECTING,
  PEER_CONNECTED,
  PNP_SERVICE_DISCONNECTED,
  PNP_SERVICE_CONNECTING,
  PNP_SERVICE_CONNECTED,
  USER_MESSAGE,
  NEW_PEER_ID
} from '../mutation-types.js'
import {
  PEER_CONNECT,
  PNP_SERVICE_CONNECT
} from '../action-types.js'
import { ambianicConf } from '@/config'
const STORAGE_KEY = 'ambianic-pnp-settings'

/**
  Reference to the PeerJS instance active
  in the current global application scope (i.e. window scope).
*/
let peer = null // own peer object
let conn = null

const state = {
  /**
    Reference to the ID of the PeerJS instance active
    in the current application. Persisted in browser localStorage.
  */
  myPeerId: window.localStorage.getItem(`${STORAGE_KEY}.myPeerId`),
  /**
    Reference to the ID of the remote PeerJS instance
    as registered with the PnP service.
  */
  remotePeerId: window.localStorage.getItem(`${STORAGE_KEY}.remotePeerId`),
  /**
    Helper reference to the ID of the PeerJS instance active
    in the current application.
  */
  lastPeerId: String,
  /**
    Reference to the ID of the room where peers in the same LAN
    with shared public IP can find each other.
  */
  roomID: String,
  /**
    Connection status message for user to see
  */
  userMessage: String,
  /**
    Status of current peer connection to remote peer
  */
  peerConnectionStatus: PEER_DISCONNECTED,
  /**
    Status of current peer connection to remote pnp service
  */
  pnpServiceConnectionStatus: PNP_SERVICE_DISCONNECTED
}

const mutations = {
  [PEER_DISCONNECTED] (state) {
    state.peerConnectionStatus = PEER_DISCONNECTED
  },
  [PEER_CONNECTING] (state) {
    state.peerConnectionStatus = PEER_CONNECTING
  },
  [PEER_CONNECTED] (state) {
    state.peerConnectionStatus = PEER_CONNECTED
  },
  [PNP_SERVICE_DISCONNECTED] (state) {
    state.pnpServiceConnectionStatus = PNP_SERVICE_DISCONNECTED
  },
  [PNP_SERVICE_CONNECTING] (state) {
    state.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTING
  },
  [PNP_SERVICE_CONNECTED] (state) {
    state.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
  },
  [USER_MESSAGE] (state, newUserMessage) {
    state.userMessage = newUserMessage
  },
  [NEW_PEER_ID] (state, newPeerId) {
    state.myPeerId = newPeerId
    window.localStorage.setItem(`${STORAGE_KEY}.myPeerId`, newPeerId)
  }
}

function setPeerConnectionHandlers (conn, state, commit) {
  conn.on('open', function () {
    commit(PEER_CONNECTED)
    commit(USER_MESSAGE, `Connected to: ${conn.peer}`)
    console.log('pnpRemote: Connected to: ', conn.peer)
    // Check URL params for commands that should be sent immediately
    // var command = getUrlParam('command')
    // if (command)
    //     conn.send(command)
  })
  // Handle incoming data (messages only since this is the signal sender)
  conn.on('data', function (data) {
    // addMessage('<span class=\'peerMsg\'>Peer:</span> ' + data)
  })
  conn.on('close', function () {
    commit(PEER_DISCONNECTED)
    commit(USER_MESSAGE, 'Connection to remote peer closed')
  })
}

const actions = {
  /**
  * Establish connection to PnP Service and
  * create the Peer object for our end of the connection.
  *
  * Set up callbacks to handle any events related to our
  * peer object.
  */
  [PNP_SERVICE_CONNECT] ({ state, commit }) {
    // Create own peer object with connection to shared PeerJS server
    console.log('pnpRemote: creating peer')
    // If we already have an assigned peerId, we will reuse it forever.
    // We expect that peerId is crypto secure. No need to replace.
    // Unless the user explicitly requests a refresh.
    console.log('pnpRemote: last saved myPeerId', state.myPeerId)
    peer = new Peer(state.myPeerId, {
      host: ambianicConf.AMBIANIC_PNP_HOST,
      secure: true,
      debug: 2
    })
    console.log('pnpRemote: peer created')
    peer.on('open', function (id) {
      commit(PNP_SERVICE_CONNECTED)
      // Workaround for peer.reconnect deleting previous id
      if (peer.id === null) {
        console.log('pnpRemote: Received null id from peer open')
        peer.id = state.myPeerId
      } else {
        if (state.myPeerId !== peer.id) {
          console.log(
            'pnpRemote: Service returned new peerId. Old, New',
            state.myPeerId,
            peer.id
          )
          commit(NEW_PEER_ID, peer.id)
        }
      }
      console.log('pnpRemote: myPeerId: ', peer.id)
    })
    peer.on('disconnected', function () {
      commit(PNP_SERVICE_DISCONNECTED)
      commit(USER_MESSAGE, 'PnP service connection lost. Please check your internet connection.')
      console.log('pnpRemote: Connection lost. Please reconnect')
      // Workaround for peer.reconnect deleting previous id
      peer.id = state.myPeerId
      peer._lastServerId = state.myPeerId
      commit(PNP_SERVICE_CONNECTING)
      peer.reconnect()
    })
    peer.on('close', function () {
      conn = null
      commit(USER_MESSAGE, 'PnP service connection destroyed. Please refresh')
      console.log('pnpRemote: Connection destroyed')
      commit(PNP_SERVICE_DISCONNECTED)
    })
    peer.on('error', function (err) {
      console.log('pnpRemote', err)
      commit(USER_MESSAGE, `PnP service connection error: ${err}`)
    })
    // remote peer tries to initiate connection
    peer.on('connection', function (conn) {
      console.log('remote peer trying to establish connection')
      setPeerConnectionHandlers(conn, state, commit)
      commit(PEER_CONNECTING)
    })
  },
  /**
  * Create the connection between the two Peers.
  *
  * Set up callbacks to handle any events related to the
  * direct peer-to-peer connection and data received on it.
  */
  [PEER_CONNECT] ({ state, commit }) {
    // Close old connection
    if (conn) {
      conn.close()
    }
    commit(PEER_DISCONNECTED)
    // Create connection to remote peer
    commit(PEER_CONNECTING)
    conn = peer.connect(state.remotePeerId, {
      reliable: true
    })
    setPeerConnectionHandlers(conn, state, commit)

    /**
    commit(PEER_CONNECTING)
    // await check if peer connection is still alive
    // if so, reuse it and return
         commit(PEER_CONNECTED)
         return
    // else
      // await try to reconnect to remote peer directly
      // if that worked, commit connected state and return
            commit(PEER_CONNECTED)
            return
      // else
      //   maybe remote peer is down or acquired a new ID
      //     (e.g. device restarted, router expired old IP, etc.)
      //   await check if pnp connection is still alive
      //     if so, commit this fact and ...
               commit(PNP_SERVICE_CONNECTED)
        //     use pnp connection to locate current remote peer address
        //     look for remote peer ID in my peer room
        //     if remote peer ID found in room
        //       store new peer ID
                 commit(SET_REMOTE_PEER_ID, newRemotePeerId)
        //       await try to connect to remote peer ID
        //       if that worked, commit connected state and return
                   commit(PEER_CONNECTED)
                   return
          //     else report connection problem to user, remote peer is unreachable
          //       schedule retry in 5 seconds
                   commit(PEER_DISCONNECTED)
          //   else, report connection problem to user, remote peer is unreachable
                    // ask user to check connection and retry
                   commit(PEER_DISCONNECTED)
     //     else, commit this fact and try to reestablish pnp connection
              commit(PNP_SERVICE_DISCONNECTED)
              commit(PNP_SERVICE_CONNECTING)
              // await try to reconnect to PNP service
              // reuse my peer ID if possible
              //   if not possible, get me a new peer ID
                     // store my newly acquired peer ID
                     commit(SET_MY_PEER_ID, myNewPeerId)
              // if PNP service connection succeeded and I have an active peer ID
              //     commit the new state change
                     commit(PNP_SERVICE_CONNECTED)
                     // find out my room ID and save it
                     commit(SET_MY_ROOM_ID, myNewRoomID)
                     // look for remote peer ID
                     // if found, save it
                        commit(SET_REMOTE_PEER_ID, newRemotePeerId)
                        // then try to connect to remote peer
                        // if that worked, commit state change and return
                              commit(PEER_CONNECTED)
                              return
                        // else
                               // report problem to user
                               // commit fact
                               commit(PEER_DISCONNECTED)
                               // ask user to check connection and retry
                     // else
                       // report problem to user
                       // commit fact
                       commit(PEER_DISCONNECTED)
                       // ask user to check connection and retry
              // else, if PNP service connection failed
                    // report problem to user
                    // commit fact
                    commit(PEER_DISCONNECTED)
                    commit(PNP_SERVICE_DISCONNECTED)
                    // ask user to check connection and retry
  */
  }
}

const pnpStoreModule = {
  state,
  mutations,
  actions
}

export default pnpStoreModule
