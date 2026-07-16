describe('Account-lifecycle', () => {
    const validForm = {
        email: `cypress@example.com`,
        password: 'password123',
        passwordRepeat: 'password123',
        firstName: 'Matti',
        lastName: 'Meikalainen',
        phonenumber: '0401234567',
        businessId: '1234567-9',
    };

    beforeEach(() => {
        cy.visit('/signup');
    });

    function fillForm(overrides: Partial<typeof validForm> = {}) {
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

    it('creates an account, then logs in', () => {
        cy.intercept('POST', '/signup').as('signupRequest'); // set up a listener BEFORE the request fires
        fillForm();
        submit();
        cy.wait('@signupRequest');

        // After a successful signup the app redirects the browser to a
        // Stripe-hosted checkout page (or to /login), which is cross-origin
        // and not worth chasing here. Visiting /login directly moves past it;
        // a successful login below is itself proof the account was created.
        cy.visit('/login');
        cy.get('input[name="email"]').type(validForm.email);
        cy.get('input[name="password"]').type(validForm.password);
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });

    it('shows an error when the email is already registered', () => {
        fillForm({ email: 'cypress@example.com' });
        submit();
        cy.contains('Email is already in use').should('be.visible');
    });

    it('shows an error when passwords do not match', () => {
        fillForm({ password: 'password123', passwordRepeat: 'different123' });
        submit();
        cy.contains('Passwords do not match').should('be.visible');
    });

    it('shows an error for an invalid email', () => {
        fillForm({ email: 'not-an-email' });
        submit();
        cy.contains('Invalid email').should('be.visible');
    });

    it('shows an error when the password is too short', () => {
        fillForm({ password: 'ab', passwordRepeat: 'ab' });
        submit();
        cy.contains('Password must be at least 5 characters').should('be.visible');
    });

    it('shows an error for an invalid business ID format', () => {
        fillForm({ businessId: '12345678' });
        submit();
        cy.contains('Business ID must be in format 1234567-8').should('be.visible');
    });

    it('shows an error for an invalid phone number', () => {
        fillForm({ phonenumber: '123' });
        submit();
        cy.contains('Phone number is too short').should('be.visible');
    });

    it('fails to log in with invalid email', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type("wrongEmail@gmail.com");
        cy.get('input[name="password"]').type(validForm.password);
        cy.get('button[type="submit"]').click();
        cy.contains('Password or email is not correct').should('be.visible');
    });

    it('fails to log in with invalid password', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type(validForm.email);
        cy.get('input[name="password"]').type("123456");
        cy.get('button[type="submit"]').click();
        cy.contains('Password or email is not correct').should('be.visible');
    });

    it('fails to log in with invalid email format', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type("123");
        cy.get('input[name="password"]').type(validForm.password);
        cy.get('button[type="submit"]').click();
        cy.contains('Invalid email').should('be.visible');
    });

    it('Logs in with correct credentials and deletes user', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type(validForm.email);
        cy.get('input[name="password"]').type(validForm.password);
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 10000 }).should('include', '/dashboard');

        // Clean up the account we just created so it doesn't linger in the DB.
        cy.visit('/settings');
        cy.contains('button', 'Delete account').click();
        cy.get('input[placeholder="DELETE"]').type('DELETE');
        cy.contains('button', 'Confirm deletion').click();
        cy.url({ timeout: 10000 }).should('include', '/account-deleted');
    });

    after(() => {
        // Best-effort cleanup, ignore errors if account doesn't exist
        cy.request({
            method: 'POST',
            url: 'http://localhost:5001/api/test-cleanup', // a test-only endpoint that deletes by email if it exists
            body: { email: validForm.email },
            failOnStatusCode: false,
        });
    });
});