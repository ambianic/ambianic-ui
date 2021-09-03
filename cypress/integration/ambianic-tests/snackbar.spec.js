/// <reference types="cypress" />

context('RemoteConnections',    () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/timeline')
    })

     it('Displays snackbar when page loads', () => {
         cy.get('[data-cy=snackbar]').find('#snack-message').should(element => {
             if (element) {
                 expect(element).to.have.length(1)
                 expect(element).to.contain('Connecting to Ambianic Edge device')
             }
         })
    })
})
