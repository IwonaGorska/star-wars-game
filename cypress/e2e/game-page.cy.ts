describe('Game Page', () => {
    beforeEach(() => {
      cy.visit('/');  // Ensure this path leads to the game page in your app
    });
  
    it('should start the game and display two entities', () => {
      // Select mix option
      cy.get('mat-radio-group').find('mat-radio-button').contains('Mix').click();
  
      // Click Start button
      cy.contains('Start').click();
  
      // Ensure that two entities are displayed
      cy.get('.entity-card', { timeout: 10000 }).should('have.length', 2);  // Adjust the timeout if necessary
    });
  
    it('should show a winner', () => {
      // Select mix option and start game
      cy.get('mat-radio-group').find('mat-radio-button').contains('Mix').click();
      cy.contains('Start').click();
  
      // Wait for loading
      cy.get('mat-progress-spinner', { timeout: 10000 }).should('exist');  // Wait for up to 10 seconds for the spinner to appear

      cy.get('mat-progress-spinner', { timeout: 10000 }).should('not.exist');
  
      // Ensure that the winner is declared
      cy.contains('wins').should('exist');
    });
  
    it('should reset the game when reset button is clicked', () => {
      // Select mix option and start game
      cy.get('mat-radio-group').find('mat-radio-button').contains('Mix').click();
      cy.contains('Start').click();
  
      // Wait for game to load
      cy.get('mat-progress-spinner', { timeout: 10000 }).should('not.exist');
  
      // Click Reset button
      cy.contains('Reset').click();
  
      // Ensure that the game has reset
      cy.get('.entity-card').should('not.exist');
      cy.contains('wins').should('not.exist');
    });
  });
  