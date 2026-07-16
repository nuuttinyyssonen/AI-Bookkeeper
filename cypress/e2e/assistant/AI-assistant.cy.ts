describe('AI Assistant', () => {
    const validForm = {
        email: `cypress-assistant@example.com`,
        password: 'password123',
        passwordRepeat: 'password123',
        firstName: 'Matti',
        lastName: 'Meikalainen',
        phonenumber: '0401234567',
        businessId: '1234567-9',
    };

    function fillSignupForm(overrides: Partial<typeof validForm> = {}) {
        const form = { ...validForm, ...overrides };

        cy.get('input[name="email"]').clear().type(form.email);
        cy.get('input[name="firstName"]').clear().type(form.firstName);
        cy.get('input[name="lastName"]').clear().type(form.lastName);
        cy.get('input[name="phonenumber"]').clear().type(form.phonenumber);
        cy.get('input[name="businessId"]').clear().type(form.businessId);
        cy.get('input[name="password"]').clear().type(form.password);
        cy.get('input[name="passwordRepeat"]').clear().type(form.passwordRepeat);
        cy.get('input[name="termsOfAgreement"]').check();
    }

    function submit() {
        cy.get('button[type="submit"]').click();
    }

    // testIsolation resets cookies between `it` blocks, so every test that needs
    // an authenticated session logs back in itself rather than relying on the
    // previous test's session.
    function login() {
        cy.visit('/login');
        cy.get('input[name="email"]').type(validForm.email);
        cy.get('input[name="password"]').type(validForm.password);
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 10000 }).should('include', '/dashboard');
    }

    function signup() {
        cy.visit('/signup');
        cy.intercept('POST', '/signup').as('signupRequest');
        fillSignupForm();
        submit();
        cy.wait('@signupRequest');
    }

    before(() => {
        // Best-effort cleanup, ignore errors if account doesn't exist
        cy.request({
            method: 'DELETE',
            url: 'http://localhost:5001/api/test-cleanup',
            body: { email: validForm.email },
            failOnStatusCode: false,
        });
    });

    it('A chat room requires subscription', () => {
        signup();
        login();
        cy.visit('/assistant');

        cy.get('[data-testid="chat-input"]').type('What is the VAT rate?');
        cy.get('[data-testid="send-message-button"]').click();

        cy.contains('[data-sonner-toast]', 'Active subscription required').should('be.visible');
    });

    it('creates a chat room and receives an AI response to the first message', () => {
        // Add subscription to test user
        cy.request('POST', 'http://localhost:5001/api/test-cleanup/grant-subscription', {
            email: validForm.email,
        });

        login();

        cy.visit('/assistant');
        cy.url({ timeout: 10000 }).should('include', '/assistant');

        cy.get('[data-testid="chat-input"]').type('What is the VAT rate?');
        cy.get('[data-testid="send-message-button"]').click();

        cy.url({ timeout: 15000 }).should('match', /\/assistant\/[^/]+$/);

        cy.get('[data-testid="chat-message"][data-role="USER"]', { timeout: 15000 })
            .should('have.length', 1)
            .and('contain.text', 'What is the VAT rate?');

        cy.get('[data-testid="chat-message"][data-role="ASSISTANT"]', { timeout: 30000 }).should(($el) => {
            expect($el.text().trim().length).to.be.greaterThan(0);
        });
    });

    it('deletes the chat room', () => {
        login();
        cy.visit('/assistant');

        cy.get('[data-testid="chat-room-item"]', { timeout: 15000 }).should('have.length', 1);
        cy.get('[data-testid="chat-room-item"]').first().within(() => {
            cy.get('[data-testid="delete-chat-room"]').click({ force: true });
        });

        cy.get('[data-testid="chat-room-item"]').should('not.exist');
    });

    after(() => {
        // Best-effort cleanup, ignore errors if account doesn't exist
        cy.request({
            method: 'DELETE',
            url: 'http://localhost:5001/api/test-cleanup',
            body: { email: validForm.email },
            failOnStatusCode: false,
        });
    });
});