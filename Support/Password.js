/* Supporting object for CrowdRise account settings tests */

const { By, Key, until } = require('selenium-webdriver');
const { support } = require('./SupportFunctions')();

module.exports = function(driver) {
    const url = 'https://www.crowdrise.com/o/en/settings/email-password',
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
        loadPage: function() {
            driver.navigate().to(url);
            return driver.wait(until.elementLocated(elements.passwordModalLink));
        },
        openPasswordModal: function() {
            find(elements.passwordModalLink).click();
            return driver.wait(until.elementLocated(elements.passwordModal));
        },
        enterCurrentPassword: function(value) {
            return find(elements.currentPasswordField).then(field => {
                field.clear();
                field.sendKeys(value);
                field.sendKeys(Key.TAB);
            });
        },
        enterNewPassword: function(value) {
            return find(elements.newPasswordField).then(field => {
                field.clear();
                field.sendKeys(value);
                field.sendKeys(Key.TAB);
            });
        },
        enterConfirmNewPassword: function(value) {
            return find(elements.confirmNewPasswordField).then(field => {
                field.clear();
                field.sendKeys(value);
                field.sendKeys(Key.TAB);
            });
        },
        submit: function() {
            find(elements.submit).click();
            return driver.wait(until.stalenessOf(driver.findElement(elements.passwordModal)));
        },
        submitExpectingError: function() {
            return find(elements.submit).click();
            // doesn't wait for the modal to close after submission
        },
        getCurrentPasswordFieldError: function() {
            return find(elements.currentPasswordFieldError).getText().then(error => {
                return error;
            });
        },
        getNewPasswordFieldError: function() {
            return find(elements.newPasswordFieldError).getText().then(error => {
                return error;
            });
        },
        getConfirmNewPasswordFieldError: function() {
            return find(elements.confirmNewPasswordFieldError).getText().then(error => {
                return error;
            });
        },
        getFailedRequirements: async function() {
            return await driver.findElements(elements.requirementsFailed).then(failedReqs => {
                return support.addElementsTextToArray(failedReqs)
            });
        },
        getModalError: function() {
            return find(elements.modalError).getText().then(error => {
                return error;
            });
        }
    };
};
