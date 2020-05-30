/**
 * This test will only work while the EC2 machines are running.
 */

/// <reference types="cypress" />

context('Check Navbar Items', () => {
    before(() => {
      // cy.visit('http://18.219.76.94')
      cy.visit('http://localhost:8080')
      cy.get('[data-cy=settings]').click()
    })

    it('Should have a search bar', () => {
        cy.get('[data-cy=container').find("#searchbar")
    })

    it('Should be a download off button', () => {
      const t = cy.get('[data-cy=download-off]')
      expect(t).to.exist
    })

    it('Should be a heart button', () => {
      const t = cy.get('[data-cy=heart]')
      expect(t).to.exist
    })

    it('Should be a bell button', () => {
      const t = cy.get('[data-cy=bell]')
      expect(t).to.exist
    })

    it('Should be an about button', () => {
      const t = cy.get('[data-cy=about]')
      expect(t).to.exist
    })

    it('Should have a five links', () => {
      cy.get('[data-cy=drawer]').then(($result) => { 
        assert.equal($result.children().children()[0].childElementCount,5,'Five links in the drawer')
      })
    })
})