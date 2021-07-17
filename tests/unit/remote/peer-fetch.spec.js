import { PeerFetch } from '@/remote/peer-fetch'
import fetchMock from 'jest-fetch-mock'

describe('PeerFetch class coverage - p2p communication layer', () => {
// global

  beforeAll(() => {
    fetchMock.enableMocks()
  })

  // mock peer instance
  let peer

  beforeEach(() => {
    peer = jest.fn()
    peer.id = 'id_6789'
    peer.options = {
      secure: true,
      host: 'a_host',
      port: '567',
      path: '/a_path/',
      key: 'a_key',
      token: 'token_9876'
    }
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.resetAllMocks()
    fetchMock.resetMocks()
    jest.clearAllTimers()
  })

  test('PeerFetch constructor', () => {
    const dataConnection = jest.fn()
    dataConnection.on = jest.fn()
    const peerFetch = new PeerFetch(dataConnection)
    expect(peerFetch._dataConnection).toBe(dataConnection)
    expect(peerFetch._requestMap).toBeEmpty()
    expect(peerFetch._nextAvailableTicket).toEqual(0)
    expect(peerFetch._nextTicketInLine).toEqual(0)
    expect(peerFetch._dataConnection.on).toHaveBeenCalledTimes(3)
    expect(peerFetch._dataConnection.on).toHaveBeenCalledWith(
      'data', expect.anything()
    )
    expect(peerFetch._dataConnection.on).toHaveBeenCalledWith(
      'open', expect.anything()
    )
    expect(peerFetch._dataConnection.on).toHaveBeenCalledWith(
      'close', expect.anything()
    )
    expect(setInterval).toHaveBeenCalledTimes(1)
    expect(setInterval).toHaveBeenCalledWith(expect.anything(), 1000)
  })
})

test('PeerFetch get()', async () => {
  const dataConnection = jest.fn()
  dataConnection.on = jest.fn()
  const mockResponse = jest.fn()
  const peerFetch = new PeerFetch(dataConnection)
  dataConnection.send = jest.fn().mockImplementation((jsonRequest) => {
    const pair = peerFetch._requestMap.get(peerFetch._nextTicketInLine)
    pair.response = mockResponse
    pair.response.receivedAll = true
  })
  jest.useRealTimers()
  const nextResponse = await peerFetch.get({ url: '/testlink', params: { a: 'one', b: 'two' } })
  expect(dataConnection.send).toHaveBeenCalledTimes(1)
  expect(nextResponse).toBe(mockResponse)
})

test('PeerFetch _schedulePing()', async () => {
  const dataConnection = jest.fn()
  dataConnection.on = jest.fn()
  const mockResponse = jest.fn()
  const peerFetch = new PeerFetch(dataConnection)
  var fetchRequest
  var fetchResponse
  dataConnection.send = jest.fn().mockImplementation((jsonRequest) => {
    fetchRequest = jsonRequest
    const pair = peerFetch._requestMap.get(peerFetch._nextTicketInLine)
    pair.response = mockResponse
    fetchResponse = mockResponse
    pair.response.receivedAll = true
  })
  jest.useFakeTimers()
  await peerFetch._schedulePing()
  // check if the ping task was scheduled
  expect(setInterval).toHaveBeenCalledTimes(1)
  expect(setInterval).toHaveBeenCalledWith(expect.anything(), 1000)
  await jest.runOnlyPendingTimers()
  expect(fetchRequest).toEqual('{"url":"ping?","method":"GET"}')
  expect(fetchResponse).toBe(mockResponse)
})

test('PeerFetch _stopPing()', async () => {
  const dataConnection = jest.fn()
  dataConnection.on = jest.fn()
  const peerFetch = new PeerFetch(dataConnection)
  jest.useFakeTimers()
  await peerFetch._schedulePing()
  // check if the ping task was scheduled
  expect(setInterval).toHaveBeenCalledTimes(1)
  expect(setInterval).toHaveBeenCalledWith(expect.anything(), 1000)
  const timer = peerFetch._keepAlive
  await peerFetch._stopPing()
  expect(clearInterval).toHaveBeenCalledTimes(1)
  expect(clearInterval).toHaveBeenCalledWith(timer)
})

test('PeerFetch _dataConnection.on("data", ...)', async () => {
  const dataConnection = jest.fn()
  dataConnection.on = jest.fn()
  const peerFetch = new PeerFetch(dataConnection)
  // get the callback function registered for dataConnection.on('data')
  const onDataCallback = peerFetch._dataConnection.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'data')[1]
  // first test the case when data arrives without a matching get request
  const cerror = jest.spyOn(console, 'error').mockImplementation(() => {})
  onDataCallback('some http response data')
  expect(cerror).toHaveBeenCalledTimes(1)
  cerror.mockReset()
  // next test the case when data arrives in response to a get request
  const request = {
    url: '/',
    method: 'GET'
  }
  const ticket = peerFetch._enqueueRequest(request)
  // test sub-use case: initial response packet has no status attribute
  const cwarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  onDataCallback('{}')
  expect(cwarn).toHaveBeenCalledWith('Remote peer may not be using a compatible protocol.')
  cwarn.mockReset()
  // test sub-use case: initial response packet arrives with header info
  const cdebug1 = jest.spyOn(console, 'debug').mockImplementation(() => {})
  onDataCallback('{"status": 202}')
  expect(cdebug1).toHaveBeenCalledWith('Received keepalive ping')
  cdebug1.mockReset()
  // test sub-use case: final status response packet arrives
  const cdebug2 = jest.spyOn(console, 'debug').mockImplementation(() => {})
  onDataCallback('{"status": 200}')
  expect(cdebug2).toHaveBeenCalledWith('Received web server final response header', expect.anything())
  cdebug2.mockReset()
  let pair = peerFetch._requestMap.get(ticket)
  expect(pair.response.receivedAll).toBeFalse()
  // test sub-use case: response packet with content arrives
  const cdebug3 = jest.spyOn(console, 'debug').mockImplementation(() => {})
  onDataCallback('some content')
  expect(cdebug3).toHaveBeenCalledWith('Processing response content')
  cdebug3.mockReset()
  pair = peerFetch._requestMap.get(ticket)
  expect(pair.response.receivedAll).toBeTrue()
  expect(pair.response.content).toEqual('some content')
})

test('PeerFetch _dataConnection.on("open", ...)', async () => {
  const dataConnection = jest.fn()
  dataConnection.on = jest.fn()
  const peerFetch = new PeerFetch(dataConnection)
  // get the callback function registered for dataConnection.on('open')
  const onOpenCallback = peerFetch._dataConnection.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'open')[1]
  jest.spyOn(peerFetch, '_schedulePing')
  onOpenCallback()
  expect(peerFetch._schedulePing).toHaveBeenCalledTimes(1)
})

test('PeerFetch _dataConnection.on("close", ...)', async () => {
  const dataConnection = jest.fn()
  dataConnection.on = jest.fn()
  const peerFetch = new PeerFetch(dataConnection)
  // get the callback function registered for dataConnection.on('close')
  const onCloseCallback = peerFetch._dataConnection.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'close')[1]
  // first test the case when data arrives without a matching get request
  jest.spyOn(peerFetch, '_stopPing')
  onCloseCallback()
  expect(peerFetch._stopPing).toHaveBeenCalledTimes(1)
})
