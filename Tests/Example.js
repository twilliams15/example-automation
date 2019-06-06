// Example

const webdriver = require('selenium-webdriver'),
      test = require('selenium-webdriver/testing'),
      chai = require('chai'),
      expect = chai.expect;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions( /* … */)
    .build();

const example = require('../Support/Example')(driver);

// Test Cases

test.describe('Example Test Suite', function() {
    
    test.before(function() {
        example.navigate();
    });

    test.it('Does something', function() {
        
    });

    test.it('Pending');

    test.after(function() {
        driver.quit();
    })
});

