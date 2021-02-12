import Axios from 'axios'

describe('Tests stripe integration with Ambianic', () => {
  test('Creates a customer on Stripe', () => {
    const cardDetails = JSON.stringify({
      number: '4242424242424242',
      cvc: '232',
      exp_year: '23',
      exp_month: '05'
    })

    Axios.post(`${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscriptions?email=test@gmail.com&card=${cardDetails}`, {}, {
      headers: {
        accept: 'Accept: application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    }).then(res => {
      expect(res.status).toBe(200)
    }).catch(e => {
      console.log(e)
    })
  })

  test('Pulls customers from stripe', () => {
    Axios.get(`${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/getCustomers`)
      .then(({ data }) => {
        console.log(data)
        expect(data).toBeDefined()
        expect(data).toBe(expect.any(Array))
      })
      .catch(e => {
        console.log(e)
      })
  })
})
