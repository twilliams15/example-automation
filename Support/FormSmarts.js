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
        checkboxes: By.css('[type="checkbox"]'),
        continue: By.css('[type="submit"]'),
        email: By.css('[placeholder="Email"]'),
        errors: By.css('.errmsg'),
        firstName: By.css('[placeholder="First Name"]'),
        lastName: By.css('[placeholder="Last Name"]'),
        orderSummary: By.css('table'),
        shippingAddress: By.css('[placeholder="Shipping Address"]'),
        summaryHeaders: By.css('th'),
        summaryValues: By.css('td')
    };
    return {
        url: 'https://formsmarts.com/form/df1?mode=h5',
        checkAllBoxes: function() {
            return driver.findElements(elements.checkboxes).then(checkboxes => {
                return checkboxes.map(checkbox => {
                    checkbox.click();
                });
            });  
        },
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
        enterDefaultsInRequiredFields: function() {
            this.enterFirstName('First');
            this.enterLastName('Last');
            this.enterEmail('email@test.com');
            this.enterShippingAddress('123 Main St');
        },
        submit: function() {
            return driver.findElement(elements.continue).then(submit => {
                submit.click();
            });
        },
        getErrors: function() {
            return driver.findElements(elements.errors);
        },
        getOrderSummary: function() {
            return driver.wait(until.elementLocated(elements.orderSummary)).then(() => {
                return driver.findElements(elements.summaryHeaders).then(headers => {
                    return driver.findElements(elements.summaryValues).then(values => {
                        let orderSummary = {};
                        for (let i = 0; i < headers.length; i++) {
                            headers[i].getText().then(header => {
                                values[i].getText().then(value => {
                                    orderSummary[header] = value;
                                });
                            });
                        }
                        return orderSummary;
                    });
                });
            });
        }
    };
};