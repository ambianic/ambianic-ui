/**
  Manage plug and play connection status to Ambianic Edge.
*/
import {
  PEER_DISCONNECTED,
  PEER_DISCOVERED,
  PEER_CONNECTING,
  PEER_AUTHENTICATING,
  PEER_CONNECTED,
  PEER_CONNECTION_ERROR,
  PNP_SERVICE_DISCONNECTED,
  PNP_SERVICE_CONNECTING,
  PNP_SERVICE_CONNECTED,
  USER_MESSAGE,
  NEW_PEER_ID,
  NEW_REMOTE_PEER_ID,
  REMOTE_PEER_ID_REMOVED
} from '../mutation-types.js'
import {
  INITIALIZE_PNP,
  PNP_SERVICE_CONNECT,
  PNP_SERVICE_RECONNECT,
  PEER_DISCOVER,
  PEER_CONNECT,
  PEER_AUTHENTICATE,
  REMOVE_REMOTE_PEER_ID
} from '../action-types.js'
import { ambianicConf } from '@/config'
import Peer from 'peerjs'
import { PeerRoom } from '@/remote/pnp'
const STORAGE_KEY = 'ambianic-pnp-settings'

/**
  Reference to the PeerJS instance active
  in the current global application scope (i.e. window scope).
*/
let peer = null // own peer object
// let peerConnection = null

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
    Connection status message for user to see
  */
  userMessage: '',
  /**
    Connection to the remote Ambianic Edge device
  */
  peerConnection: null,
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
    state.peerConnection = null
    state.peerConnectionStatus = PEER_DISCONNECTED
  },
  [PEER_DISCOVERED] (state) {
    state.peerConnectionStatus = PEER_DISCOVERED
  },
  [PEER_CONNECTING] (state) {
    state.peerConnectionStatus = PEER_CONNECTING
  },
  [PEER_AUTHENTICATING] (state) {
    state.peerConnectionStatus = PEER_AUTHENTICATING
  },
  [PEER_CONNECTED] (state, peerConnection) {
    state.peerConnection = peerConnection
    state.peerConnectionStatus = PEER_CONNECTED
  },
  [PEER_CONNECTION_ERROR] (state) {
    state.peerConnectionStatus = PEER_CONNECTION_ERROR
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
  },
  [NEW_REMOTE_PEER_ID] (state, newRemotePeerId) {
    console.log('Setting state.remotePeerId to : ', newRemotePeerId)
    state.remotePeerId = newRemotePeerId
    window.localStorage.setItem(`${STORAGE_KEY}.remotePeerId`, newRemotePeerId)
  },
  [REMOTE_PEER_ID_REMOVED] (state) {
    console.log('Removing remote Peer Id from local storage')
    state.remotePeerId = null
    window.localStorage.removeItem(`${STORAGE_KEY}.remotePeerId`)
  }
}

/**
  Try to discover remote peer ID.
  If we already know the remote Peer ID, we will use it.
  Otherwise try to discover it automatically or with user's help.
  Once discovered, the remote peer Id will be saved
  and reused until explicitly reset by the user.
*/
async function discoverRemotePeerId ({ peer, state, commit }) {
  if (state.remotePeerId) {
    return state.remotePeerId
  } else {
    // first try to find the remote peer ID in the same room
    const myRoom = new PeerRoom(peer)
    console.log('Fetching room members', myRoom)
    const { clientsIds } = await myRoom.getRoomMembers()
    const peerIds = clientsIds
    console.log('myRoom members', clientsIds)
    const remotePeerId = peerIds.find(
      pid => pid !== state.myPeerId)
    if (remotePeerId) {
      return remotePeerId
    } else {
      // unable to auto discover
      // ask user for help
      commit(USER_MESSAGE,
        `Still looking.
         Please make sure you are on the same local network
         as the Ambianic Edge device.
        `)
    }
  }
}

function setPnPServiceConnectionHandlers (
  { state, commit, dispatch }, peer) {
  peer.on('open', function (id) {
    commit(PNP_SERVICE_CONNECTED)
    // Workaround for peer.reconnect deleting previous id
    if (peer.id === null) {
      console.log('pnpService: Received null id from peer open')
      peer.id = state.myPeerId
    } else {
      if (state.myPeerId !== peer.id) {
        console.log(
          'pnpService: Service returned new peerId. Old, New',
          state.myPeerId,
          peer.id
        )
        commit(NEW_PEER_ID, peer.id)
      }
    }
    console.log('pnpService: myPeerId: ', peer.id)
    // signaling server connection established
    // we can advance to peer discovery
    dispatch(PEER_DISCOVER)
  })
  peer.on('disconnected', function () {
    commit(PNP_SERVICE_DISCONNECTED)
    commit(USER_MESSAGE, 'PnP service connection lost. Please check your internet connection.')
    console.log('pnpService: Connection lost. Please reconnect.')
  })
  peer.on('close', function () {
    // peerConnection = null
    commit(USER_MESSAGE, 'PnP service connection destroyed. Please refresh')
    console.log('pnpService: Connection destroyed')
    commit(PNP_SERVICE_DISCONNECTED)
  })
  peer.on('error', function (err) {
    console.log('peer connection error', err)
    commit(USER_MESSAGE,
      `
      Error while connecting. Will retry shortly. Is the Internet connection OK?
      `)
    commit(PEER_CONNECTION_ERROR)
    console.log('peerConnectionStatus', state.peerConnectionStatus)
    // retry peer connection in a few seconds
    setTimeout(() => {
      dispatch(INITIALIZE_PNP)
    }, 3000)
  })
  // remote peer tries to initiate connection
  peer.on('connection', function (peerConnection) {
    console.log('remote peer trying to establish connection')
    setPeerConnectionHandlers({ state, commit, dispatch }, peerConnection)
    commit(PEER_CONNECTING)
  })
}

function setPeerConnectionHandlers ({ state, commit, dispatch }, peerConnection) {
  // setup connection progress callbacks
  peerConnection.on('open', function () {
    dispatch(PEER_AUTHENTICATE, peerConnection)
  })
  // Handle incoming data (messages only since this is the signal sender)
  peerConnection.on('data', function (data) {
    // addMessage('<span class=\'peerMsg\'>Peer:</span> ' + data)
    console.log('pnpService: Data message received: %s', data)
    // if data is authentication challenge response, verify it
    // for now we asume authentication passed
    const authMessage = true
    if (authMessage) {
      const authPassed = true
      if (authPassed) {
        commit(PEER_CONNECTED, peerConnection)
      }
    }
  })

  peerConnection.on('close', function () {
    commit(PEER_DISCONNECTED)
    commit(USER_MESSAGE, 'Connection to remote peer closed')
  })
}

const actions = {
  /**
  * Initialize PnP Service and Peer Connection
  */
  async [INITIALIZE_PNP] ({ state, commit, dispatch }) {
    await dispatch(PNP_SERVICE_CONNECT)
  },
  /**
  * Establish connection to PnP Service and
  * create the Peer object for our end of the connection.
  *
  * Set up callbacks to handle any events related to our
  * peer object.
  */
  async [PNP_SERVICE_CONNECT] ({ state, commit, dispatch }) {
    // if connection to pnp service already open, then nothing to do
    if (peer && peer.open) return
    // Create own peer object with connection to shared PeerJS server
    console.log('pnpService: creating peer')
    // If we already have an assigned peerId, we will reuse it forever.
    // We expect that peerId is crypto secure. No need to replace.
    // Unless the user explicitly requests a refresh.
    console.log('pnpService: last saved myPeerId', state.myPeerId)
    peer = new Peer(state.myPeerId, {
      host: ambianicConf.AMBIANIC_PNP_HOST,
      port: ambianicConf.AMBIANIC_PNP_PORT,
      secure: ambianicConf.AMBIANIC_PNP_SECURE,
      debug: 3
    })
    console.log('pnpService: peer created')
    setPnPServiceConnectionHandlers({ state, commit, dispatch }, peer)
    commit(PNP_SERVICE_CONNECTING)
  },
  /**
  * Establish connection to PnP Service and
  * create the Peer object for our end of the connection.
  *
  * Set up callbacks to handle any events related to our
  * peer object.
  */
  async [PNP_SERVICE_RECONNECT] ({ state, commit, dispatch }) {
    // if connection to pnp service already open, then nothing to do
    if (peer.open) return
    console.log('pnpService: reconnecting peer...')
    // Workaround for peer.reconnect deleting previous id
    if (!peer.id) {
      console.log('BUG WORKAROUND: Peer lost ID. Resetting to last known ID.')
      peer._id = state.myPeerId
    }
    peer._lastServerId = state.myPeerId
    commit(PNP_SERVICE_CONNECTING)
    peer.reconnect()
  },
  /**
  * Find remotePeerId for Ambianic Edge device to pair with.
  *
  */
  async [PEER_DISCOVER] ({ state, commit, dispatch }) {
    const discoveryLoopId = async () => {
      // start a discovery loop
      console.log('Discovering remote peer...')
      // its possible that the PNP signaling server connection was disrupted
      // while looping in peer discovery mode.
      if (state.pnpServiceConnectionStatus === PNP_SERVICE_DISCONNECTED) {
        console.log('PNP Service disconnected. Reconnecting...')
        await dispatch(PNP_SERVICE_RECONNECT)
      }
      let remotePeerId
      try {
        if (state.pnpServiceConnectionStatus === PNP_SERVICE_CONNECTED) {
          remotePeerId = await discoverRemotePeerId({ peer, state, commit })
        } else {
          // signaling server connection is still not ready, skip this cycle
          // and wait for the next scheduled retry
          console.log('PNP Service still not connected. Will retry shortly.')
        }
      } catch (err) {
        console.log('Error while looking for remote peer. Will retry shortly.',
          err)
      }
      if (remotePeerId) {
        console.log('Remote peer Id found', remotePeerId)
        commit(PEER_DISCOVERED)
        // remote Edge peer discovered, let's connect to it
        dispatch(PEER_CONNECT, remotePeerId)
      } else {
        setTimeout(discoveryLoopId, 3000) // retry in a few seconds
      }
    }
    await discoveryLoopId()
  },
  /**
  * Create the connection between the two Peers.
  *
  * Set up callbacks to handle any events related to the
  * direct peer-to-peer connection and data received on it.
  */
  async [PEER_CONNECT] ({ state, commit, dispatch }, remotePeerId) {
    // if already connected to peer, then nothing to do
    if (state.peerConnectionStatus === PEER_CONNECTED) return
    console.log('Connecting to remote peer', remotePeerId)
    commit(PEER_CONNECTING)
    const peerConnection = peer.connect(remotePeerId, {
      reliable: true, serialization: 'raw', somethingCrazy: 1234
    })
    setPeerConnectionHandlers({ state, commit, dispatch }, peerConnection)
  },
  /**
  * Authenticate remote peer. Make sure its a genuine Ambianic Edge device.
  *
  */
  async [PEER_AUTHENTICATE] ({ state, commit, dispatch }, peerConnection) {
    commit(PEER_AUTHENTICATING)
    commit(USER_MESSAGE, `Authenticating remote peer: ${peerConnection.peer}`)
    console.log('Authenticating remote Peer ID: ', peerConnection.peer)
    if (state.remotePeerId !== peerConnection.peer) {
      // remote Peer ID is new
      commit(NEW_REMOTE_PEER_ID, peerConnection.peer)
    }
    // Check URL params for commands that should be sent immediately
    // var command = getUrlParam('command')
    // if (command)
    const msg = JSON.stringify({
      type: 'http-request',
      method: 'GET',
      path: '/fingerprint',
      params: {
        user: 'ambianic-ui'
      }
    })
    peerConnection.send(msg)
    console.log('DataChannel transport capabilities',
      peerConnection.dataChannel)
  },
  /**
  * Remove remote peer id from local store.
  * Maybe the edge device is damaged and its id cannot be recovered.
  * In such cases the user will request removal of the existing device
  * association and force discovery of a new edge device id.
  */
  async [REMOVE_REMOTE_PEER_ID] ({ state, commit, dispatch }) {
    if (state.peerConnectionStatus !== PEER_DISCONNECTED) {
      const conn = state.peerConnection
      conn.close()
      commit(PEER_DISCONNECTED)
    }
    commit(REMOTE_PEER_ID_REMOVED)
    dispatch(PEER_DISCOVER)
  }
}

const getters = {
  isEdgeConnected: state => {
    return state.peerConnectionStatus === PEER_CONNECTED
  }
}

const pnpStoreModule = {
  state,
  getters,
  mutations,
  actions
}

export default pnpStoreModule
