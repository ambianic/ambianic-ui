/// <reference types="cypress" />

context('index.html', () => {
  beforeEach(() => {
    cy.visit('/')
  })


  const checkViewPort = (cy, device) => {
    cy.viewport(device).window().then(win => {
        cy.title().should('eq', 'Ambianic UI')

        cy.get('head meta[name="description"][content*="Ambianic UI"]')

        cy.get('#welcome-text')
          .should('contain', 'Safer Home via Ambient Intelligence' )

        cy.get('[data-cy=btn-continue]')
          .get('.v-btn__content')
          .contains('Continue', { matchCase: false })
    })
  }


  //Set an array of sizes
  const sizes = [
    'iphone-5', 'iphone-6' , 'samsung-s10', 'samsung-note9', 'iphone-x', 'iphone-xr',
    'ipad-mini', 'ipad-2', 'macbook-11', 'macbook-13',
    'macbook-16'
  ]

  describe('Find page elements correctly in a range of browser device viewports', () => {
    sizes.forEach(size => {
      it(`Should display elements correctly on ${size}`, () => {
        // ensure elements are shown on smaller viewports
        checkViewPort(cy, size)
      })
    })
  })
})
