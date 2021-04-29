/// <reference types="cypress" />

export const checkViewPort = (cy, device) => {
  cy.viewport(device)
  expect(cy.get("[data-cy=login]")).to.exist
}

context('Check Navbar Items', () => {
  before(() => {
    cy.visit('http://localhost:8080')
    cy.get('[data-cy=timeline]').click()
  })

  it('Should have a search bar', () => {
    cy.get('[data-cy=container').find('#searchbar')
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

  it('Should display upgrade icon on different viewports', () => {
    expect(cy.get("[data-cy=profile-component]")).to.exist

    expect(cy.get("[data-cy=login]")).to.exist
    expect(cy.get(".upgrade-text")).to.exist

    checkViewPort(cy, 'ipad-mini')
    checkViewPort(cy, 'ipad-2')
    checkViewPort(cy, 'macbook-11')
    checkViewPort(cy, 'macbook-13')
    expect(cy.get(".upgrade-text")).to.exist

    checkViewPort(cy, 'iphone-5')
    checkViewPort(cy, 'iphone-6')
    checkViewPort(cy, 'samsung-s10')
    checkViewPort(cy, 'samsung-note9')
    checkViewPort(cy, 'iphone-x')
    checkViewPort(cy, 'iphone-xr')
  })

  it('Should have a five links', () => {
    cy.get('[data-cy=drawer]').then(($result) => {
      assert.equal($result.children().children()[0].childElementCount, 5, 'Five links in the drawer')
    })
  })

  it('Should have a clickable timeline icon', () => {
    const icon =  cy.get('[data-cy=timeline-icon]')
    
    icon.should("be.visible")

    icon.click()

    cy.url().should('include', '/timeline')
  })
})