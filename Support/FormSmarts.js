/* Form Smarts Support
 *
 * Supporting page object for Form Smarts.
 */

const webdriver = require('selenium-webdriver'),
      By = webdriver.By,
      until = webdriver.until,
      Key = webdriver.Key;

module.exports = function(driver) {
    const elements = {
        firstName: By.css('[placeholder="First Name"]'),
        lastName: By.css('[placeholder="Last Name"]'),
        email: By.css('[placeholder="Email"]'),
        shippingAddress: By.css('[placeholder="Shipping Address"]'),
        country: By.css(''),
        product1: By.css(''),
        product2: By.css(''),
        product2Quantity: By.css(''),
        continue: By.css('[type="submit"]'),
        errors: By.css('.errmsg')
    };
    return {
        url: 'https://formsmarts.com/form/df1?mode=h5',
        enterFirstName: function(value) {
            return driver.findElement(elements.firstName).then(firstName => {
                firstName.clear();
                firstName.sendKeys(value);
            });
        },
        enterLastName: function(value) {
            return driver.findElement(elements.lastName).then(lastName => {
                lastName.clear();
                lastName.sendKeys(value);
            });
        },
        enterEmail: function(value) {
            return driver.findElement(elements.email).then(email => {
                email.clear();
                email.sendKeys(value);
            });
        },
        enterShippingAddress: function(value) {
            return driver.findElement(elements.shippingAddress).then(shippingAddress => {
                shippingAddress.clear();
                shippingAddress.sendKeys(value);
            });
        },
        submit: function() {
            return driver.findElement(elements.continue).click();
        },
        findErrorMessages: function() {
            return driver.findElements(elements.errors);
        }
    };
};