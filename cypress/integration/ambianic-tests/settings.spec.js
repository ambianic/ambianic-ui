/// <reference types="cypress" />

context('Settings', () => {
    before(() => {
      cy.visit('http://localhost:8080/settings')
      // cy.get('[data-cy=settings]').click()
    })

    it('Should have a title card', () => {
        cy.get('[data-cy=titlecard]').contains('Ambianic Edge connection details')
    })

    it('Should have a local ambianic edge title card', () => {
      cy.get('[data-cy=localtitlecard]').contains('Pair with local Ambianic Edge device')
    })

    it('Should have a remote ambianic edge title card', () => {
      cy.get('[data-cy=remotetitlecard]').contains('Pair with remote Ambianic Edge device')
    })

    it('Should have remote connection button disabled', () => {
      cy.get('[data-cy=sendRemotePeerID]').should('be.disabled')  
    })

    it('Should have remote connection button enabled', () => {  
      cy.get('[data-cy=remotePeerID]').type('917d5f0a-6469-4d33-b5c2-efd858118b74')
      cy.get('[data-cy=sendRemotePeerID]').should('be.enabled')
    })

    it('Should have a row', () => {
      cy.get('[data-cy=template-row]').should('exist')
    })

    it("It display connected edge version after connection", () => {
      cy.get('[data-cy=sendRemotePeerID]').click()

      cy.window().then(win => {
        win.__store__.commit('PEER_CONNECTED', null)

        const versionNumber = require('../../../package.json').version
        cy.get('[data-cy=title-text]').should('contain.text', versionNumber )
    })
    })
})