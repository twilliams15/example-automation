// Starbucks Example Test

const webdriver = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const chai = require('chai');
const expect = chai.expect;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions( /* … */)
    .build();

const signIn = require('../Support/StarbucksSignIn')(driver);

test.describe('Starbucks Sign In Test Suite', function() {
    
    test.describe('The sign in form', function() {
    
        test.before(function () {
            driver.navigate().to(signIn.url);
        });

        test.it('validates empty email', function() {
            signIn.enterUsername('');
            signIn.waitForUsernameValidation().then(validation => {
                validation.isDisplayed().then(isDisplayed => {
                    expect(isDisplayed).to.be.true;
                })
            });
        });

        test.it('validates empty password', function() {
            signIn.enterPassword('');
            signIn.waitForPasswordValidation().then(validation => {
                validation.isDisplayed().then(isDisplayed => {
                    expect(isDisplayed).to.be.true;
                })
            });
        });

        test.it.only('throws an error for incorrect email', function() {
            signIn.enterUsername('wrong username');
            signIn.enterPassword(signIn.password);
            signIn.submit();
            signIn.waitForAlert().then(x => console.log(x));
        });

        test.it('throws an error for incorrect password');
        
        test.it('the user can sign into the account', function() {
            signIn.enterUsername(signIn.username);
            signIn.enterPassword(signIn.password);
            signIn.submit();
            driver.getCurrentUrl().then(url => {
                expect(url).to.equal(signIn.signedInUrl);
            });
        });

        test.after(function() {
            driver.quit();
        });
    });
});