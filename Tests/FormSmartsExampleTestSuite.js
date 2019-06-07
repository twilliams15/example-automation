/* Form Smarts Example Test Suite
 *
 * Created by Todd Williams for example purposes.
 */

const webdriver = require('selenium-webdriver'),
      chai = require('chai'),
      expect = chai.expect;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

const form = require('../Support/FormSmarts')(driver),
      orderSummaries = require('../Support/OrderSummaries')();

// Test Cases

describe('Form Smarts Example Test Suite', function() {

    beforeEach(function (done) {
        driver.navigate().to(form.url).then(done);
    });
    
    describe('Required Fields', function() {

        it('First Name is required', function(done) {
            form.enterFirstName('');
            form.enterLastName('Last');
            form.enterEmail('email@test.com');
            form.enterShippingAddress('123 Main St');
            form.submit();
            form.getErrors().then(errors => {
                expect(errors.length).to.equal(1);
                done();
            });
        });

        it('Last Name is required', function(done) {
            form.enterFirstName('First');
            form.enterLastName('');
            form.enterEmail('email@test.com');
            form.enterShippingAddress('123 Main St');
            form.submit();
            form.getErrors().then(errors => {
                expect(errors.length).to.equal(1);
                done();
            });
        });

        it('Email Address is required', function(done) {
            form.enterFirstName('First');
            form.enterLastName('Last');
            form.enterEmail('');
            form.enterShippingAddress('123 Main St');
            form.submit();
            form.getErrors().then(errors => {
                expect(errors.length).to.equal(1);
                done();
            });
        });

        it('Shipping Address is required', function(done) {
            form.enterFirstName('First');
            form.enterLastName('Last');
            form.enterEmail('email@test.com');
            form.enterShippingAddress('');
            form.submit();
            form.getErrors().then(errors => {
                expect(errors.length).to.equal(1);
                done();
            });
        });

        it('Form can be submitted using only required fields', function(done) {
            form.enterDefaultsInRequiredFields();
            form.submit();
            form.getErrors().then(errors => {
                expect(errors.length).to.equal(0);
                done();
            });
        });
    });

    describe('Order Summary', function() {

        it('Displays the correct summary - Variation 1 - Defaults', function(done) {
            form.enterDefaultsInRequiredFields();
            form.submit();
            form.getOrderSummary().then(orderSummary => {
                expect(orderSummary).to.deep.equal(orderSummaries.var1);
                done();
            });
        });

        it('Displays the correct summary - Variation 2 - Checkboxes', function(done) {
            form.enterDefaultsInRequiredFields();
            form.checkAllBoxes();
            form.submit();
            form.getOrderSummary().then(orderSummary => {
                expect(orderSummary).to.deep.equal(orderSummaries.var2);
                done();
            });
        });

        it('Displays the correct summary - Variation 3 - Radios');
    });

    after(function (done) {
        driver.quit().then(done);
    });
});