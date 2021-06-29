/// <reference types="cypress" />

context('SubscriptionModal', () => {
  before(async () => {
    cy.visit('http://localhost:8080/timeline')

    const win = await cy.window()

    await win.__store__.dispatch('SAVE_AUTHENTICATED_USER', {
      isLoadingAuth: false
    })

    await win.__store__.dispatch('HANDLE_SUBSCRIPTION_DIALOG', true)
  })

  it('It displays subscription details', () => {
    cy.get('.headline').contains('Premium Subscription')

    const detail = cy.get('[data-cy=detail]')
    const price = cy.get('[data-cy=price]')

    detail.should('be.visible')

    // price should be dynamic hence a `contains` assertion cant be used
    price.should('be.visible')
  })

  it('It displays input fields and accept values', () => {
    cy.get('[data-cy=subscribe]').click()

    cy.window().then(win => {
      win.__store__.dispatch('SAVE_AUTHENTICATED_USER', {
        user: {
          email: 'test@mail.com',
          sub: 'auth0|12121212',
          name: 'test user'
        },
        loadingAuth: false,
        isAuthenticated: true
      })

      const name = cy.get('[name=cardHolderName]')
      const number = cy.get('[name=cardNumber]')
      const email = cy.get('[name=emailAddress]')

      name.should('be.visible')
      name.type('john doe')

      number.should('be.visible')
      number.type('1212-4545-5454-1234')

      email.should('be.visible')
      email.type('johndoe@gmail.com')
    })
  })

  it('It validates card-number regex is functional', () => {
    cy.get('[data-cy=confirm-btn]').should('be.disabled')

    cy.get('[name=cardNumber]').type('4242424242424242')

    cy.get('[data-cy=confirm-btn]').should('be.enabled')
  })

  it('It contains 7 input forms', () => {
    cy.get('input').its('length').should('be.eq', 7)
  })

  it('Should close modal at click of `Cancel` button', () => {
    cy.get('[data-cy=dismiss-modal]').click()

    cy.get('#subscription-details').should('not.be.visible')
  })
})
