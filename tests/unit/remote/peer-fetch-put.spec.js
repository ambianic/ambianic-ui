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

test('PeerFetch put()', async () => {
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
