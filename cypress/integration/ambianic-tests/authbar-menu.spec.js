/// <reference types="cypress" />

context('Profile menu', () => {
  before(() => {
    cy.visit('http://localhost:8080/timeline')
  })

  it('It shows a tour element for new authenticated users', () => {
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

    cy.get('#tour-element-button').should('be.visible')
  })

  it('Tour button ends tour and closes tour element', () => {
    cy.get('#vue-tour-button').click()
    cy.get('#tour-element-button').should('not.exist')
  })

  it('User image is shown for authenticated users', () => {
    const profileBtn = cy.get('[data-cy=profile-toggle]')

    profileBtn.should('be.visible')
    profileBtn.children('.user-img').should('have.length', 1)
  })

  it('Elements in Profile Card contain user details', () => {
    cy.get('[data-cy=profile-toggle]').click()

    expect(cy.get('[data-cy=user_avatar]')).exist

    cy.get('[data-cy=fullname]')
      .should('contain.text', 'test user')

    cy.get('[data-cy=email]')
      .should('contain.text', 'test@mail.com')

    cy.get('[data-cy=logout-button]').should('be.visible')
  })

  it('It opens subscription modal at click of `Add Subscription` button', () => {
    cy.get('#subscription').should('not.be.visible')

    cy.get('[data-cy=add-subscription]').click()
    cy.get('#subscription-details').should('be.visible')
  })
})
