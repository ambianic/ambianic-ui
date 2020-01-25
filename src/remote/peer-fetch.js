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
      console.debug('Remote 11111 Peer Data message received (type %s): %s',
        typeof (data), data)
      // we expect data to be a response to a previously sent request message
      const response = data
      const ticket = peerFetch._nextTicketInLine
      console.debug(peerFetch, peerFetch._requestMap, ticket, response)
      // const blah = {
      //   url: 'http://localhost:8778/?from=_dataConnection.on_data'
      // }
      // const msg = JSON.stringify(blah)
      // const dc = peerFetch._dataConnection
      // console.error('>>>>>>>>>>>>>>>>>> Sending msg', { dc, msg })
      // peerFetch._dataConnection.send(msg)
      // update request map entry with this response
      const pair = peerFetch._requestMap.get(ticket)
      if (pair) {
        pair.response = response
      } else {
        console.error('No entry found in pending requestMap for ticket',
          { ticket })
      }
    })
  }

  /**
  * REST API over HTTP GET
  */
  async get ({ url = '/', params = {} }) {
    console.debug('PeerFetch.get', { url, params })
    if (params.size > 0) {
      var esc = encodeURIComponent
      var query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&')
      url += '?' + query
    }
    const request = {
      url,
      method: 'GET'
    }
    // get a ticket that matches the request
    // and use it to claim the corresponding
    // response when availably
    const ticket = this._queueRequest(request)
    const response = await this._receiveResponse(ticket)
    return response
  }

  _queueRequest (request) {
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
    if (this._nextTicketInLine < this._nextAvailableTicket) {
      this._sendNextRequest(ticket)
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

  jsonify (arrayBuffer) {
    const decodedString = this.textDecode(arrayBuffer)
    const response = JSON.parse(decodedString)
    return response
  }

  async _receiveResponse (ticket) {
    const timeout = 300 * 1000 // 30 seconds
    const timerStart = Date.now()
    let timeElapsed = timerStart
    let request, response
    do {
      ({ request, response } = this._requestMap.get(ticket))
      if (response) {
        // if (typeof(response) === 'string') {
        this._ticketProcessed(ticket)
        console.debug('Received response', { ticket, request, response })
        // schedule processing of next request shortly
        setTimeout(() => this._processNextTicketInLine(), 50)
        return response
      } else {
        console.debug('Waiting for response', { ticket, request })
        // this._processNextTicketInLine()
      }
      timeElapsed = Date.now() - timerStart
      await sleep(1000)
    } while (!response && timeElapsed < timeout)
    if (!response) {
      throw Error('PeerFetch Timeout while waiting for response.')
    }
  }
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
