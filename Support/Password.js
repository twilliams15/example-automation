/* Supporting object for CrowdRise account settings tests */

const { By, Key, until } = require('selenium-webdriver');
const { support } = require('./SupportFunctions')();

module.exports = function(driver) {
    const url = 'https://local.crowdrise.com/o/en/settings/email-password',
          elements = {
              passwordModalLink: By.css('#email-password > div > div:nth-child(6) > button'),
              passwordModal: By.css('.modal-dialog'),
              currentPasswordField: By.css('#currentPassword'),
              currentPasswordFieldError: By.css('#currentPassword ~ small.help-block'),
              newPasswordField: By.css('#password'),
              newPasswordFieldError: By.css('#password ~ small.help-block'),
              confirmNewPasswordField: By.css('#confirmPassword'),
              confirmNewPasswordFieldError: By.css('#confirmPassword ~ small.help-block'),
              submit: By.css('[type="submit"]'),
              requirementsFailed: By.css('.color-status-red'),
              requirementsPassed: By.css('.color-status-green'),
              modalError: By.css('#password-form div.alert')
          };
    function find(element) {
        driver.wait(until.elementLocated(element));
        return driver.findElement(element);
    };
    return {
        // Loads the account settings page
        loadPage: function() {
            driver.navigate().to(url);
            return driver.wait(until.elementLocated(elements.passwordModalLink));
        },
        // Opens the modal for updating the password
        openPasswordModal: function() {
            find(elements.passwordModalLink).click();
            return driver.wait(until.elementLocated(elements.passwordModal));
        },
        // Enters a value into the Current Password field
        enterCurrentPassword: function(value) {
            return find(elements.currentPasswordField).then(field => {
                field.clear();
                field.sendKeys(value);
                field.sendKeys(Key.TAB);
            });
        },
        // Enters a value into the New Password field
        enterNewPassword: function(value) {
            return find(elements.newPasswordField).then(field => {
                field.clear();
                field.sendKeys(value);
                field.sendKeys(Key.TAB);
            });
        },
        // Enters a value into the Confirm New Password field
        enterConfirmNewPassword: function(value) {
            return find(elements.confirmNewPasswordField).then(field => {
                field.clear();
                field.sendKeys(value);
                field.sendKeys(Key.TAB);
            });
        },
        // Submits the password modal form and waits for it to close
        submit: function() {
            find(elements.submit).click();
            return driver.wait(until.stalenessOf(driver.findElement(elements.passwordModal)));
        },
        // Submits the password modal form but doesn't wait for it to close
        submitExpectingError: function() {
            return find(elements.submit).click();
        },
        // Grabs validation text on the Current Password field
        getCurrentPasswordFieldError: function() {
            return find(elements.currentPasswordFieldError).getText().then(error => {
                return error;
            });
        },
        // Grabs validation text on the New Password field
        getNewPasswordFieldError: function() {
            return find(elements.newPasswordFieldError).getText().then(error => {
                return error;
            });
        },
        // Grabs validation text on the Confirm New Password field
        getConfirmNewPasswordFieldError: function() {
            return find(elements.confirmNewPasswordFieldError).getText().then(error => {
                return error;
            });
        },
        // Builds an array of failed password requirements
        getFailedRequirements: async function() {
            return await driver.findElements(elements.requirementsFailed).then(failedReqs => {
                return support.addElementsTextToArray(failedReqs)
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
