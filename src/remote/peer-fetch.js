/**
 * Emulates HTML Fetch API over peer-to-peer
 * DataConnection (WebRTC DataChannel)
*/
export class PeerFetch {
  constructor (dataConnection) {
    // the DataConnection that PeerFetch rides on
    this._dataConnection = dataConnection
    // Map of pending requests awaiting responses
    this._requestMap = new Map()
    // incrementing counter to the next available
    // unused ticket number
    // Each request is assigned a ticket
    // which can be used to claim the response
    this._nextAvailableTicket = 0
    // points to the next ticket assigned to a pending request
    // Requests are processed in FIFO order.
    this._nextTicketInLine = 0
    this._configureDataConnection()
    this._schedulePing()
  }

  /**
   * Schedule periodic pings to keep the datachannel alive.
   * Some routers and firewalls close open ports within seconds
   * without data packets flowing through.
   */
  _schedulePing () {
    this._keepAlive = setInterval(
      async () => {
        // check if there are any pending requests
        // no ping needed as long as there is traffic on the channel
        if (!this._pendingRequests()) {
          // request top page
          const request = {
            url: 'ping'
          }
          await this.get(request)
        }
      },
      1000 // every second
    )
  }

  /**
  * Stop keepalive pings.
  */
  _stopPing () {
    clearInterval(this._keepAlive)
  }

  /**
    Return the next available ticket number
    and simultaneously increment the ticket counter.
  */
  _drawNewTicket () {
    return this._nextAvailableTicket++
  }

  /**
    Move on to next pending ticket
  */
  _ticketProcessed (ticket) {
    const errorMsg = 'response received out of order!'
    const nextTicket = this._nextTicketInLine
    console.assert(
      ticket === nextTicket,
      { ticket, nextTicket, errorMsg }
    )
    // remove entry from pending request map
    this._requestMap.delete(ticket)
    this._nextTicketInLine++
  }

  _configureDataConnection () {
    // Handle incoming data (messages only since this is the signal sender)
    const peerFetch = this
    this._dataConnection.on('data', function (data) {
      console.debug('Remote Peer Data message received (type %s)',
        typeof (data), { data })
      // we expect data to be a response to a previously sent request message
      const ticket = peerFetch._nextTicketInLine
      console.debug(peerFetch, peerFetch._requestMap, ticket, data)
      // update request-response map entry with this response
      const pair = peerFetch._requestMap.get(ticket)
      if (pair) {
        if (!pair.response) {
          console.debug('Processing response header')
          // this is the first data message from the responses
          const header = peerFetch.jsonify(data)
          if (header.status === 202) {
            console.debug('Received keepalive ping')
            // server accepted the request but still working
            // ignore and keep waiting until result or timeout
          } else {
            console.debug('Received web server final response header',
              { header })
            // save header part of the response
            // and wait for the p2p data messages with the content body
            const receivedAll = false
            pair.response = { header, receivedAll }
          }
        } else {
          console.debug('Processing response content')
          // response content body arrived
          pair.response.content = data
          // assume for now that all response content can fit
          // in a single 64KB data message
          pair.response.receivedAll = true
        }
      } else {
        console.error('No entry found in pending requestMap for ticket',
          { ticket })
      }
    })
    this._dataConnection.on('open', function () {
      peerFetch._schedulePing()
    })
    this._dataConnection.on('close', function () {
      peerFetch._stopPing()
    })
  }

  /**
  * REST API over HTTP GET
  */
  async get ({ url = '/', params = {} }) {
    console.debug('PeerFetch.get enter', { url, params })
    var esc = encodeURIComponent
    var query = Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&')
    url += '?' + query
    console.debug('PeerFetch.get', { url, query })
    console.debug('PeerFetch.get post process', { url })
    const request = {
      url,
      method: 'GET'
    }
    // get a ticket that matches the request
    // and use it to claim the corresponding
    // response when availably
    const ticket = this._enqueueRequest(request)
    const response = await this._receiveResponse(ticket)
    return response
  }

  _enqueueRequest (request) {
    const ticket = this._drawNewTicket()
    console.debug(this._requestMap)
    this._requestMap.set(ticket, { request })
    if (this._requestMap.size === 1) {
      // there are no other pending requests
      // let's send this one on the wire
      this._sendNextRequest(ticket)
    }
    return ticket
  }

  /**
    Send next pending request to remote peer.
    Requests are sent one at a time.
    Only when a previous request response arrives
    is the next request sent across the wire.

    In the future we can look at handling multiple requests
    and responses in parallel over the same data connection or
    even a pool of connections.
  */
  _sendNextRequest (ticket) {
    const { request } = this._requestMap.get(ticket)
    const jsonRequest = JSON.stringify(request)
    const requestMap = this._requestMap
    console.debug('Sending request to remote peer',
      { requestMap, ticket, request })
    try {
      this._dataConnection.send(jsonRequest)
    } catch (error) {
      console.error('Error sending message via Peer DataConnection', { error })
    }
  }

  _processNextTicketInLine () {
    const ticket = this._nextTicketInLine
    // check if there is a pending ticket
    // and process it
    if (this._pendingRequests()) {
      this._sendNextRequest(ticket)
    }
  }

  /**
  * Check if there are any pending requests waiting in line.
  */
  _pendingRequests () {
    if (this._nextTicketInLine < this._nextAvailableTicket) {
      return true
    }
  }

  textDecode (arrayBuffer) {
    let decodedString
    if ('TextDecoder' in window) {
      // Decode as UTF-8
      var dataView = new DataView(arrayBuffer)
      var decoder = new TextDecoder('utf8')
      decodedString = decoder.decode(dataView)
    } else {
      // Fallback decode as ASCII
      decodedString = String.fromCharCode.apply(null,
        new Uint8Array(arrayBuffer))
    }
    console.debug({ decodedString })
    return decodedString
  }

  jsonify (data) {
    let decodedString
    if (typeof data === 'string') {
      decodedString = data
    } else {
      decodedString = this.textDecode(data)
    }
    const response = JSON.parse(decodedString)
    return response
  }

  _checkResponseReady (ticket) {
    let request = null
    let response = null;
    ({ request, response } = this._requestMap.get(ticket))
    if (response && response.receivedAll) {
      this._ticketProcessed(ticket)
      console.debug('Received full response', { ticket, request, response })
      // schedule processing of next request shortly
      setTimeout(() => this._processNextTicketInLine(), 50)
      return response
    } else {
      console.debug('Waiting for response...', { ticket, request })
      return null
    }
  }

  async _receiveResponse (ticket) {
    const timeout = 10 * 60 * 1000 // 10 minutes
    const timerStart = Date.now()
    let timeElapsed = 0
    let response = null
    do {
      response = this._checkResponseReady(ticket)
      timeElapsed = Date.now() - timerStart
      await sleep(200)
      console.debug('Response time elapsed:', { ticket, timeElapsed })
    } while (!response && timeElapsed < timeout)
    if (!response) {
      // check if response came in after the last sleep
      // before timeout.
      response = this._checkResponseReady(ticket)
    }
    if (response) {
      console.debug('Returning full response', { response })
      return response
    } else {
      throw Error('PeerFetch Timeout while waiting for response.')
    }
  }
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
