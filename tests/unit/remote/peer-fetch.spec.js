import PeerFetch from '../../../src/remote/peer-fetch.js'

beforeAll(() => {
  jest.spyOn(PeerFetch.prototype, '_drawNewTicket').mockImplementation(() => '12');
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('Modify class', () => {
  let peer = new PeerFetch();
    expect(peer._drawNewTicket()).toBe("12");
});