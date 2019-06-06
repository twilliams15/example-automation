/* Form Smarts Example Test Suite
 *
 * Created by Todd Williams for example purposes.
 */

const webdriver = require('selenium-webdriver'),
      test = require('selenium-webdriver/testing'),
      chai = require('chai'),
      expect = chai.expect;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions( /* … */)
    .build();

const form = require('../Support/FormSmarts')(driver),
      orderSummaries = require('../Support/OrderSummaries')();

// Test Cases

test.describe('Form Smarts Example Test Suite', function() {

    test.beforeEach(function () {
        driver.navigate().to(form.url);
    });
    
    test.describe('Required Fields', function() {

        test.it('First Name is required', function() {
            form.enterFirstName('');
            form.enterLastName('Last');
            form.enterEmail('email@test.com');
            form.enterShippingAddress('123 Main St');
            form.submit();
            form.findErrorMessages().then(errors => {
                expect(errors.length).to.equal(1);
            });
        });

        test.it('Last Name is required', function() {
            form.enterFirstName('First');
            form.enterLastName('');
            form.enterEmail('email@test.com');
            form.enterShippingAddress('123 Main St');
            form.submit();
            form.findErrorMessages().then(errors => {
                expect(errors.length).to.equal(1);
            });
        });

        test.it('Email Address is required', function() {
            form.enterFirstName('First');
            form.enterLastName('Last');
            form.enterEmail('');
            form.enterShippingAddress('123 Main St');
            form.submit();
            form.findErrorMessages().then(errors => {
                expect(errors.length).to.equal(1);
            });
        });

        test.it('Shipping Address is required', function() {
            form.enterFirstName('First');
            form.enterLastName('Last');
            form.enterEmail('email@test.com');
            form.enterShippingAddress('');
            form.submit();
            form.findErrorMessages().then(errors => {
                expect(errors.length).to.equal(1);
            });
        });

        test.it('Form can be submitted using only required fields', function() {
            form.enterFirstName('First');
            form.enterLastName('Last');
            form.enterEmail('email@test.com');
            form.enterShippingAddress('123 Main St');
            form.submit();
            form.findErrorMessages().then(errors => {
                expect(errors.length).to.equal(0);
            });
        });
    });

    test.describe('Order Summary', function() {

        test.it('Displays the correct summary - Variation 1 - Defaults', function() {
            form.enterDefaultsInRequiredFields();
            form.submit();
            form.getOrderSummary().then(orderSummary => {
                expect(orderSummary).to.deep.equal(orderSummaries.var1);
            });
        });

        test.it('Displays the correct summary - Variation 2 - Checkboxes', function() {
            form.enterDefaultsInRequiredFields();
            form.checkAllBoxes();
            form.submit();
            form.getOrderSummary().then(orderSummary => {
                expect(orderSummary).to.deep.equal(orderSummaries.var2);
            });
        });

        test.it('Displays the correct summary - Variation 3 - Radios');
    });

    test.after(function () {
        driver.quit();
    });
});