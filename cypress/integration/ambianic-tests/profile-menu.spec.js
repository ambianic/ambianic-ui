/// <reference types="cypress" />

context('Profile menu', () => {
  before(() => {
    cy.visit('http://localhost:8080/timeline')
  })

  it('Should start authentication with Auth0', () => {
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
    })

    cy.get('#vue-tour-button').click()
    cy.get('[data-cy=profile-toggle]').click()
  })

  it('Confirm Profile Card Elements', () => {
    expect(cy.get('[data-cy=user_avatar]')).exist

    cy.get('[data-cy=fullname]')
      .should('contain.text', 'test user')

    cy.get('[data-cy=email]')
      .should('contain.text', 'test@mail.com')

    cy.get('[data-cy=logout-button]').should('be.visible')
  })

  it('Should open subscription modal', () => {
    cy.get('[data-cy=add-subscription]').click()
    cy.get('[data-cy=dismiss-modal]').click()
  })
})
