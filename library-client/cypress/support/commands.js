Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: Cypress.env('url'),
    body: {
      email: Cypress.env('email'),
      password: Cypress.env('password')
    }
  })
})

beforeEach(() => {
  cy.login()
})
