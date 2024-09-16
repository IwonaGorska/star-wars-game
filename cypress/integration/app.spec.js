describe('My Angular App', () => {
    it('should display the homepage', () => {
      cy.visit('/');
      cy.contains('Your app is running');
    });
  });
  