describe('Receipts', () => {
    const validForm = {
        email: `cypress-receipts@example.com`,
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

    before(() => {
        // Best-effort cleanup, ignore errors if account doesn't exist
        cy.request({
            method: 'DELETE',
            url: 'http://localhost:5001/api/test-cleanup',
            body: { email: validForm.email },
            failOnStatusCode: false,
        });
    });

    it('creates an account and uploads a receipt to work with', () => {
        cy.visit('/signup');
        cy.intercept('POST', '/signup').as('signupRequest');
        fillSignupForm();
        submit();
        cy.wait('@signupRequest');

        login();

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

        cy.contains('[data-sonner-toast]', /\d+\/\d+ receipt\(s\) analyzed/, { timeout: 20000 }).should('be.visible');
    });

    it('views and edits the receipt to known values', () => {
        login();
        cy.visit('/receipts');

        cy.get('[data-testid="receipt-card"]', { timeout: 30000 }).should('have.length', 1);
        cy.get('[data-testid="receipt-card"]').first().within(() => {
            cy.contains('a', 'View').click();
        });
        cy.url({ timeout: 10000 }).should('match', /\/receipts\/[^/]+$/);

        cy.contains('button', 'Edit receipt').click();
        cy.get('input[name="vendor_name"]').clear().type('Cypress Test Vendor');
        cy.get('input[name="total_amount"]').clear().type('42.5');
        cy.get('input[name="receipt_date"]').clear().type('2026-01-15');
        cy.contains('button', 'Save changes').click();

        cy.contains('[data-sonner-toast]', 'Receipt updated successfully').should('be.visible');
        cy.contains('Cypress Test Vendor').should('be.visible');
        cy.contains('42.5').should('be.visible');

        // Confirm the edit actually persisted server-side, not just local state.
        cy.reload();
        cy.contains('Cypress Test Vendor').should('be.visible');
        cy.contains('button', 'Edit receipt').click();
        cy.get('input[name="receipt_date"]').should('have.value', '2026-01-15');
        cy.contains('button', 'Cancel').click();
    });

    it('filters the receipts list by search, date range, and tabs', () => {
        login();
        cy.visit('/receipts');

        cy.get('[data-testid="receipt-card"]', { timeout: 30000 }).should('have.length', 1);

        // Search narrows to a match, and to no matches.
        cy.get('input[placeholder="Search vendor..."]').type('Cypress Test Vendor');
        cy.get('[data-testid="receipt-card"]').should('have.length', 1);
        cy.contains('Cypress Test Vendor').should('be.visible');

        cy.get('input[placeholder="Search vendor..."]').clear().type('Nonexistent Vendor Zzz');
        cy.get('[data-testid="receipt-card"]').should('not.exist');
        cy.contains('No receipts found').should('be.visible');

        cy.contains('button', 'Clear').click();
        cy.get('input[placeholder="Search vendor..."]').should('have.value', '');
        cy.get('[data-testid="receipt-card"]').should('have.length', 1);

        // Date range that excludes the receipt.
        cy.get('input[type="date"]').eq(0).type('2026-01-16');
        cy.get('[data-testid="receipt-card"]').should('not.exist');
        cy.contains('No receipts found').should('be.visible');

        cy.contains('button', 'Clear').click();
        cy.get('[data-testid="receipt-card"]').should('have.length', 1);

        // Date range that includes the receipt.
        cy.get('input[type="date"]').eq(0).type('2026-01-01');
        cy.get('input[type="date"]').eq(1).type('2026-01-31');
        cy.get('[data-testid="receipt-card"]').should('have.length', 1);

        cy.contains('button', 'Clear').click();

        // Income tab should be empty since this receipt was uploaded as an expense.
        cy.contains('button', /^Income/).click();
        cy.get('[data-testid="receipt-card"]').should('not.exist');
        cy.contains('No receipts found').should('be.visible');

        cy.contains('button', /^Expenses/).click();
        cy.get('[data-testid="receipt-card"]').should('have.length', 1);
    });

    it('updates the category and deductible settings on the receipt', () => {
        login();
        cy.visit('/receipts');

        cy.get('[data-testid="receipt-card"]').first().within(() => {
            cy.contains('a', 'View').click();
        });
        cy.url({ timeout: 10000 }).should('match', /\/receipts\/[^/]+$/);

        cy.get('select').select('TOIMISTOKULUT');
        cy.get('select').should('have.value', 'TOIMISTOKULUT');

        // Toggle deductible off, then back on.
        cy.contains('button', 'Yes').click();
        cy.contains('button', 'No').should('be.visible');
        cy.contains('button', 'No').click();
        cy.contains('button', 'Yes').should('be.visible');

        // Pick a preset percentage, then a custom one.
        cy.contains('button', '50%').click();
        cy.contains('button', '50%').should('have.class', 'bg-teal-600');

        cy.contains('button', 'Other').click();
        cy.get('input[type="number"]').last().type('33');
        cy.get('input[type="number"]').last().blur();

        // Confirm everything persisted server-side.
        cy.reload();
        cy.get('select').should('have.value', 'TOIMISTOKULUT');
        cy.contains('button', 'Yes').should('be.visible');
        cy.contains('button', 'Other').click();
        cy.get('input[type="number"]').last().should('have.value', '33');
    });

    it('deletes the receipt', () => {
        login();
        cy.visit('/receipts');

        cy.get('[data-testid="receipt-card"]').first().within(() => {
            cy.contains('a', 'View').click();
        });
        cy.url({ timeout: 10000 }).should('match', /\/receipts\/[^/]+$/);

        cy.contains('button', 'Delete receipt').click();
        cy.contains('[data-sonner-toast]', 'File deleted successfully').should('be.visible');
        cy.contains('Receipt deleted').should('be.visible');

        cy.contains('a', 'Back to receipts').click();
        cy.url({ timeout: 10000 }).should('include', '/receipts');
        cy.get('[data-testid="receipt-card"]').should('not.exist');
        cy.contains('No receipts found').should('be.visible');
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
