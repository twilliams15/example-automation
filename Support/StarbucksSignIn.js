/* Starbucks Sign In
 *
 * Supporting page object for Starbucks Sign In page.
 */


const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const Key = webdriver.Key;

module.exports = function(driver) {
    const elements = {
        usernameField: By.css('#username'),
        passwordField: By.css('#password'),
        signInButton: By.css('[type="submit"]'),
        usernameValidation: By.css('#username-validationHint'),
        passwordValidation: By.css('#password-validationHint')
    };
    return {
        url:  'https://www.starbucks.com/account/signin',
        signedInUrl: 'https://app.starbucks.com/',
        username: '1example@test.com',
        password: 'Starbucks1!',
        elements: elements,
        enterUsername: function(value) {
            const usernameField = driver.findElement(elements.usernameField);
            usernameField.clear();
            usernameField.click();
            usernameField.sendKeys(value);
            usernameField.sendKeys(Key.TAB); //allows for validation checks
        },
        enterPassword: function(value) {
            const passwordField = driver.findElement(elements.passwordField);
            passwordField.clear();
            passwordField.click();
            passwordField.sendKeys(value);
            passwordField.sendKeys(Key.TAB); //allows for validation checks
        },
        submit: function() {
            const signInButton = driver.findElement(elements.signInButton)
            signInButton.click();
            return driver.wait(until.stalenessOf(signInButton));
        },
        waitForUsernameValidation: function() {
            return driver.wait(until.elementLocated(elements.usernameValidation)).then(element => {
                return driver.wait(until.elementIsVisible(element));
            });
        },
        waitForPasswordValidation: function() {
            return driver.wait(until.elementLocated(elements.passwordValidation)).then(element => {
                return driver.wait(until.elementIsVisible(element));
            });
        },
        waitForAlert: function() {
            return driver.wait(until.alertIsPresent());
        }
    };
};