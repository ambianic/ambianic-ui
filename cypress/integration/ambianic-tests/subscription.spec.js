/// <reference types="cypress" />

context('SubscriptionModal', () => {
  before(() => {
    cy.visit('http://localhost:8080/timeline')
  })

  it('Should launch subscription modal', () => {
    cy.get('[data-cy=auth-btn]').click()

    cy.get('.headline').contains('Premium Subscription')
  })

  it('It displays subscription details', () => {
    const detail = cy.get('[data-cy=detail]')
    const price = cy.get('[data-cy=price]')
    
    detail.should('be.visible')
    price.should('be.visible').contains(`$5 Monthly Fee`)
  })

  it('It displays input fields and accept values', () => {
    cy.get('[data-cy=subscribe]').click()
    
    cy.window().then(win => {
      win.__store__.dispatch("SAVE_AUTHENTICATED_USER", {
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
    // TODO: enabled after cards have been tested
    // cy.get('[data-cy=confirm-btn]').should('be.disabled')

    cy.get('[name=cardNumber]').type('4242424242424242')

    cy.get('[data-cy=confirm-btn]').should('be.enabled')
  })

  it('It contains 7 input forms', () => {
    cy.get('input').its('length').should('be.eq', 7)
  })

  it('It should dismiss subscription modal after subscription', () => {
    cy.get('[data-cy=dismiss-modal]').click()
  })
})
