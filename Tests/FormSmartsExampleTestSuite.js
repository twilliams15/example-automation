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

const form = require('../Support/FormSmarts')(driver);

// Test Cases

test.describe('Form Smarts Example Test Suite', function() {
    
    test.describe('Required Fields', function() {
    
        test.before(function () {
            driver.navigate().to(form.url);
        });

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

        test.after(function () {
            driver.quit();
        });
    });
});