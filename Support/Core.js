/* Core Support for CrowdRise tests */

const { By, Key, until } = require('selenium-webdriver');

module.exports = function(driver) {
    const url = 'https://www.crowdrise.com/signin/form',
          elements = {
              loginEmail: By.css('#email_address_login'),
              loginPassword: By.css('#password_login'),
              loginSubmit: By.css('[type="submit"]')
          };
    return {
        email: '1example@test.com',
        password: 'Password1!',
        logIn: function() {
            driver.navigate().to(url);
            driver.findElement(elements.loginEmail).sendKeys(this.email);
            driver.findElement(elements.loginPassword).sendKeys(this.password);
            driver.findElement(elements.loginSubmit).click();
            return driver.wait(until.stalenessOf(driver.findElement(elements.loginEmail)));
        }
    };
};
