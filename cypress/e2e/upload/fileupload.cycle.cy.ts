describe('Upload-cycle', () => {
    const validForm = {
        email: `cypress@example.com`,
        password: 'password123',
        passwordRepeat: 'password123',
        firstName: 'Matti',
        lastName: 'Meikalainen',
        phonenumber: '0401234567',
        businessId: '1234567-9',
    };

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

    before(() => {
        // Best-effort cleanup, ignore errors if account doesn't exist
        cy.request({
            method: 'DELETE',
            url: 'http://localhost:5001/api/test-cleanup', // a test-only endpoint that deletes by email if it exists
            body: { email: validForm.email },
            failOnStatusCode: false,
        });
    });

    it('creates an account', () => {
        cy.visit('/signup');
        cy.intercept('POST', '/signup').as('signupRequest'); // set up a listener BEFORE the request fires
        fillForm();
        submit();
        cy.wait('@signupRequest');
    });

    it('Uploads file successfully', () => {
        // Log in first: a successful redirect to /dashboard is proof the account
        // actually persisted (the signup response status alone doesn't guarantee
        // this, since the client can delete the user again if checkout-session
        // creation fails after signup succeeds). Only then grant the subscription,
        // otherwise grant-subscription can race a user row that isn't there yet.
        cy.visit('/login');
        cy.get('input[name="email"]').type(validForm.email);
        cy.get('input[name="password"]').type(validForm.password);
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 10000 }).should('include', '/dashboard');

        // Grant an active subscription so the upload route isn't blocked by the paywall
        cy.request('POST', 'http://localhost:5001/api/test-cleanup/grant-subscription', {
            email: validForm.email,
        });

        cy.get('[data-testid="upload-link"]').click();
        cy.url({ timeout: 10000 }).should('include', '/upload');

        cy.get('input[type="file"]').first().selectFile('cypress/fixtures/test.jpg', { force: true });
        cy.contains('test.jpg').should('be.visible');

        cy.get('input[type="file"]').first().closest('.rounded-xl').within(() => {
            cy.contains('button', 'Upload').click();
        });

        // Wait for the analysis toast (e.g. "1/1 receipt(s) analyzed") before moving on,
        // since analysis is polled asynchronously after the upload toast fires.
        cy.contains('[data-sonner-toast]', /\d+\/\d+ receipt\(s\) analyzed/, { timeout: 20000 }).should('be.visible');

        cy.visit('/receipts');
        cy.get('[data-testid="receipt-card"]', { timeout: 30000 }).should('have.length.greaterThan', 0);
    });

    after(() => {
        // Best-effort cleanup, ignore errors if account doesn't exist
        cy.request({
            method: 'DELETE',
            url: 'http://localhost:5001/api/test-cleanup', // a test-only endpoint that deletes by email if it exists
            body: { email: validForm.email },
            failOnStatusCode: false,
        });
    });
});