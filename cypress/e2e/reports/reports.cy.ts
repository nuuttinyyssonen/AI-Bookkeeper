describe('Reports', () => {
    const validForm = {
        email: `cypress-reports@example.com`,
        password: 'password123',
        passwordRepeat: 'password123',
        firstName: 'Matti',
        lastName: 'Meikalainen',
        phonenumber: '0401234567',
        businessId: '1234567-9',
    }

    function fillSignupForm(overrides: Partial<typeof validForm> = {}) {
        const form = { ...validForm, ...overrides };

        cy.get('input[name="email"]').clear().type(form.email);
        cy.get('input[name="firstName"]').clear().type(form.firstName);
        cy.get('input[name="lastName"]').clear().type(form.lastName);
        cy.get('input[name="phonenumber"]').clear().type(form.phonenumber);
        cy.get('input[name="businessId"]').clear().type(form.businessId);
        cy.get('input[name="password"]').clear().type(form.password);
        cy.get('input[name="passwordRepeat"]').clear().type(form.passwordRepeat);
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

    it('A report requires subscription', () => {
        signup();
        login();
        cy.visit('/reports');
        cy.url({ timeout: 10000 }).should('include', '/reports');

        // New report button from header
        cy.get('[data-testid="new-report-button"]').click();

        // Open timeperiod options and choose timeperiod
        cy.get('[data-testid="select-timeperiod"]').select('Q1');
        
        // Generate report
        cy.get('[data-testid="generate-report"]').click();

        // Subscription page redirect and toast message 
        cy.contains('[data-sonner-toast]', 'Active subscription required').should('be.visible');
    });

    it('Creates report successfully', () => {
        // Add subscription to test user
        cy.request('POST', 'http://localhost:5001/api/test-cleanup/grant-subscription', {
            email: validForm.email,
        });

        login();
        
        cy.visit('/reports');

        cy.url({ timeout: 10000 }).should('include', '/reports');

        cy.get('[data-testid="new-report-button"]').click();
        cy.get('[data-testid="select-timeperiod"]').select('Q1');
        cy.get('[data-testid="generate-report"]').click();

        cy.get('[data-testid="report-row"]', { timeout: 15000 }).should('have.length.greaterThan', 0);

        cy.get('[data-testid="report-row"]').first().within(() => {
            cy.get('[data-testid="report-period"]').should('not.be.empty');
            cy.get('[data-testid="report-type"]').should('contain.text', 'Q1');
            cy.get('[data-testid="report-sales-vat"]').should('contain.text', '€');
            cy.get('[data-testid="report-purchase-vat"]').should('contain.text', '€');
            cy.get('[data-testid="report-payable"]').should('not.be.empty');
            cy.get('[data-testid="report-status"]').should('be.visible');
            cy.get('[data-testid="report-created"]').should('not.be.empty');
        });
    });

    it('views the report and its details', () => {
        login();
        cy.visit('/reports');

        cy.get('[data-testid="report-row"]', { timeout: 15000 }).should('have.length.greaterThan', 0);
        cy.get('[data-testid="report-row"]').first().within(() => {
            cy.get('[data-testid="report-view-link"]').click();
        });

        cy.url({ timeout: 10000 }).should('match', /\/reports\/[^/]+$/);

        cy.contains('VAT Report').should('be.visible');
        cy.contains('Sales VAT').should('be.visible');
        cy.contains('Purchase VAT').should('be.visible');
        cy.contains(/VAT (Payable|Refund)/).should('be.visible');
    });

    it('deletes the report', () => {
        login();
        cy.visit('/reports');

        cy.get('[data-testid="report-row"]', { timeout: 15000 }).should('have.length.greaterThan', 0);
        cy.get('[data-testid="report-row"]').first().within(() => {
            cy.get('[data-testid="report-view-link"]').click();
        });

        cy.url({ timeout: 10000 }).should('match', /\/reports\/[^/]+$/);

        cy.contains('button', 'Delete').click();
        cy.contains('[data-sonner-toast]', 'Report deleted successfully').should('be.visible');
        cy.contains('Report deleted').should('be.visible');

        cy.contains('a', 'Back to reports').click();
        cy.url({ timeout: 10000 }).should('include', '/reports');
        cy.get('[data-testid="report-row"]').should('not.exist');
        cy.contains('No reports yet').should('be.visible');
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