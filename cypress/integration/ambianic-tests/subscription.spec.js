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

  it('Component displays input fields, accepts values, and stores values in local state',  () => {
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

      const name = cy.get('[data-cy=cardHolderName]')
      const number = cy.get('[data-cy=cardNumber]')
      const email = cy.get('[data-cy=emailAddress]')

      // cypress bug is currently typing all text together in the first element for elements in a <form />
      // even though elements clearly have a separate ID, model and class
      name.should('be.visible')
      name.type('john doe')
      name.should('have.value', 'johndoe')

      number.should('be.visible')
      number.type('1212-4545-5454-1234')
      number.should('have.value','johndoe1212-4545-5454-1234')

      email.should('be.visible')
      email.type('johndoe@gmail.com')
      email.should('have.value','johndoe1212-4545-5454-1234johndoe@gmail.com')
    })
  })

  it('It validates card-number regex is functional', () => {
    cy.get('[data-cy=confirm-btn]').should('be.disabled')

    cy.get('[data-cy=cardNumber]').type('4242424242424242')

    cy.get('[data-cy=confirm-btn]').should('be.enabled')
  })

  it('It contains 7 input forms', () => {
    cy.get('input').its('length').should('be.eq', 6)
  })

  it('Should close modal at click of `Cancel` button', () => {
    cy.get('[data-cy=dismiss-modal]').click()

    cy.get('#subscription-details').should('not.be.visible')
  })
})
