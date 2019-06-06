// Example Support

const webdriver = require('selenium-webdriver'),
      By = webdriver.By,
      until = webdriver.until,
      Key = webdriver.Key;

module.exports = function(driver) {
    const elements = {

    };
    return {
        url: 'https://www.google.com/',
        navigate: function() {
            driver.navigate().to(this.url);
        }
    };
};