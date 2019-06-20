/* Supporting object for CrowdRise account settings tests */

const { By, Key, until } = require('selenium-webdriver');

module.exports = function(driver) {
    const url = 'https://www.crowdrise.com/o/en/settings/email-password',
          elements = {
              emailModalLink: By.css('#email-password > div > button'),
              emailModal: By.css('.modal-dialog'),
              emailField: By.css('#email'),
              emailFieldError: By.css('#email ~ small.help-block'),
              passwordField: By.css('#password'),
              passwordFieldError: By.css('#password ~ small.help-block'),
              submit: By.css('[type="submit"]'),
              displayEmail: By.css('#email-password > div > div.h4.settings-block'),
              modalError: By.css('#email-form > div > div.alert')
          };
    function find(element) {
        driver.wait(until.elementLocated(element));
        return driver.findElement(element);
    };
    return {
        loadPage: function() {
            driver.navigate().to(url);
            return driver.wait(until.elementLocated(elements.emailModalLink));
        },
        openEmailModal: function() {
            find(elements.emailModalLink).click();
            return driver.wait(until.elementLocated(elements.emailModal));
        },
        enterEmail: function(value) {
            return find(elements.emailField).then(field => {
                field.clear();
                field.sendKeys(value);
                field.sendKeys(Key.TAB);
            });
        },
        enterPassword: function(value) {
            return find(elements.passwordField).then(field => {
                field.clear();
                field.sendKeys(value);
                field.sendKeys(Key.TAB);
            });
        },
        submit: function() {
            find(elements.submit).click();
            return driver.wait(until.stalenessOf(driver.findElement(elements.emailModal)));
        },
        submitExpectingError: function() {
            return find(elements.submit).click();
        },
        getDisplayEmail: function() {
            return find(elements.displayEmail).getText().then(displayEmail => {
                return displayEmail;
            });
        },
        getEmailFieldError: function() {
            return find(elements.emailFieldError).getText().then(error => {
                return error;
            });
        },
        getPasswordFieldError: function() {
            return find(elements.passwordFieldError).getText().then(error => {
                return error;
            });
        },
        getModalError: function() {
            return find(elements.modalError).getText().then(error => {
                return error;
            });
        }
    };
};
