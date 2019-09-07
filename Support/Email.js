/* Supporting object for CrowdRise account settings tests */

const { By, Key, until } = require('selenium-webdriver');

module.exports = function(driver) {
    const url = 'https://local.crowdrise.com/o/en/settings/email-password',
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
        // Loads the account settings page
        loadPage: function() {
            driver.navigate().to(url);
            return driver.wait(until.elementLocated(elements.emailModalLink));
        },
        // Opens the modal for updating the email
        openEmailModal: function() {
            find(elements.emailModalLink).click();
            return driver.wait(until.elementLocated(elements.emailModal));
        },
        // Enters a value into the email field
        enterEmail: function(value) {
            return find(elements.emailField).then(field => {
                field.clear();
                field.sendKeys(value);
                field.sendKeys(Key.TAB);
            });
        },
        // Enters a value into the password field
        enterPassword: function(value) {
            return find(elements.passwordField).then(field => {
                field.clear();
                field.sendKeys(value);
                field.sendKeys(Key.TAB);
            });
        },
        // Submits the email modal form and waits for it to close
        submit: function() {
            find(elements.submit).click();
            return driver.wait(until.stalenessOf(driver.findElement(elements.emailModal)));
        },
        // Submits the email modal form but doesn't wait for it to close
        submitExpectingError: function() {
            return find(elements.submit).click();
        },
        // Grabs the current email displayed to the user outside of the modal
        getDisplayEmail: function() {
            return find(elements.displayEmail).getText().then(displayEmail => {
                return displayEmail;
            });
        },
        // Grabs the validation text on the email field
        getEmailFieldError: function() {
            return find(elements.emailFieldError).getText().then(error => {
                return error;
            });
        },
        // Grabs the validation text on the password field
        getPasswordFieldError: function() {
            return find(elements.passwordFieldError).getText().then(error => {
                return error;
            });
        },
        // Grabs the error from the modal for an incorrect submission
        getModalError: function() {
            return find(elements.modalError).getText().then(error => {
                return error;
            });
        }
    };
};
