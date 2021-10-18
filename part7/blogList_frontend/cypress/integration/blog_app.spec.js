describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'Travis Draper',
      name: 'Travis',
      password: 'travis draper'
    }

    cy.request('POST', 'http://localhost:3003/api/users', user)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log into application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Travis Draper')
      cy.get('#password').type('travis draper')
      cy.get('#login-button').click()

      cy.contains('Travis logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('Travis Draper')
      cy.get('#password').type('blergh')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Travis logged-in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Travis Draper', password: 'travis draper' })
      cy.createBlog({ title: 'Cypress Test Blog 1', url:'www.CypressTest.com' })
    })

    it('An appended blog can be created', function() {
      cy.contains('Create New Blog').click()
      cy.get('.blogFormTitle').type('Cypress Test Blog 2')
      cy.get('.blogFormUrl').type('www.CypressTest.com')
      cy.contains('Post').click()

      cy.contains('Cypress Test Blog 2')
      cy.contains('Cypress Test Blog 1')
      cy.get('.blogDiv').then( blogs => {
        cy.wrap(blogs).should('have.length', 2)
      })
    })
  })

  describe('When a blog exists', function() {
    beforeEach(function() {
      cy.login({ username: 'Travis Draper', password: 'travis draper' })
      cy.createBlog({ title: 'Cypress Test Blog 1', url:'www.CypressTest.com' })
      cy.createBlog({ title: 'Cypress Test Blog 2', url:'www.CypressTest.com' })
      cy.createBlog({ title: 'Cypress Test Blog 3', url:'www.CypressTest.com' })
    })

    it('User can like a blog', function() {
      cy.contains('Cypress Test Blog 2')
        .contains('Show').click()

      cy.contains('likes').as('theLike')
        .should('contain', 0)

      cy.get('@theLike').contains('Like').click()

      cy.get('@theLike')
        .should('contain', '1')
    })

    it('User can delete blog they created', function() {
      cy.contains('Cypress Test Blog 2')
        .contains('Show').click()

      cy.contains('Cypress Test Blog 2')
        .contains('Remove').click()

      cy.get('html').should('not.contain', 'Cypress Test Blog 2')
    })

    it.only('Blog rearranges in descending order of likes', function() {
      cy.get('.blogDiv').then(blogs => {

        blogs.each((index) => {
          cy.contains(`Cypress Test Blog ${index + 1}`)
            .contains('Show').click()

          for(let i=0; i<index; i++) {
            cy.contains('Like').click()
          }

          cy.contains(`Cypress Test Blog ${index + 1}`)
            .contains('Hide').click()
        })
      })

      cy.get('.blogDiv').first().should('contain', 'Cypress Test Blog 3')
      cy.get('.blogDiv').last().should('contain', 'Cypress Test Blog 1')
    })
  })
})