/// <reference types="cypress" />
import {CHANGE_REMOTE_PEER_ID} from '../../../src/store/action-types';

context('HomePage', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('Loads title and subtitle', () => {
        cy.get('.v-list-item__subtitle')
            .should('contain.text', 'Safe Home - via Ambient Intelligence')
    })

    it('Loads firsttime installation button', () => {
        cy.get('#btn-timeline > .v-btn__content')
            .should('contain.text', 'Continue Setup')
            .click()
    })

    it('Ensures returning users are taken directly to timeline', () => {
        cy.window().should('have.property', '__store__')
        cy.window().then(win => {
            win.__store__.dispatch(CHANGE_REMOTE_PEER_ID, '917d5f0a-6469-4d33-b5c2-efd858118b74')
            cy.wait(1000)

            // reload to use new values for testing
            cy.reload()

            cy.url().should('include', '/timeline')
        })
    })
})
