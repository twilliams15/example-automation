const webdriver = require('selenium-webdriver')
    , test = require('selenium-webdriver/testing')
    , chai = require('chai')
    , chaiWebdriver = require('chai-webdriver')
    , expect = chai.expect
    , By = webdriver.By
    , until = webdriver.until
    , Key = webdriver.Key;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions( /* … */)
    .build();

chai.use(chaiWebdriver(driver));

const baseUrl = 'https://www.crowdrise.com';

// test.describe('Test Suite', function() {
//  this.timeout(60000);

//  test.before(function () {
//      driver.get(baseUrl);
//  });

//  const expectedTitle = 'Fundraising Website - Raise Money Online For Causes & Charities - CrowdRise';
//  test.it(`The title of the page should be "${expectedTitle}"`, function() {
//      driver.getTitle().then(currentTitle => {
//          expect(currentTitle).to.equal(expectedTitle)
//      });
//  });

//  test.it('The header should be "Social fundraising that actually works for nonprofits"', function() {
//      expect('h1').dom.to.have.text('Social fundraising that actually works for nonprofits')
//  });

//  test.it('The "Start Fundraising Now" button links to the Claim Flow', function() {
//      driver.findElement(By.linkText('Start Fundraising Now')).click();
//      driver.getCurrentUrl().then(url => {
//          expect(url).to.contain('/charities/claim')
//      });
//  });

//  test.it('Logging in', function() {
//      logIn();
//      driver.wait(until.titleIs('Fundraising Website - Raise Money Online For Causes & Charities - CrowdRise'), 10000);
//  });

//  test.after(function() {
//      driver.quit();
//  });
// });

// test.describe('Campaign creation', function() {
//  this.timeout(60000);

//  test.before(function () {
//      driver.get(baseUrl);
//      logIn();
//      driver.get(baseUrl + '/fundraise-and-volunteer/signup/campaign-create');
//  });

//  test.it('accepts a title', function() {
//      driver.findElement(By.id('title')).sendKeys('Test Campaign');
//  });

//  test.it('accepts a goal', function() {
//      driver.findElement(By.id('goal')).sendKeys('1,000');
//  });
    
//  test.it('accepts a story', function() {
//      driver.findElement(By.css('.public-DraftEditor-content')).click();
//      driver.findElement(By.css('.public-DraftEditor-content')).sendKeys('Lorem ipsum...');
//  });

//  test.after(function() {
//      driver.quit();
//  });
// });

test.describe('Email & Password Test Suite', function() {
    this.timeout(15000); // 15 seconds

    test.before(function () {
        driver.get(baseUrl + '/signin/form/o/en/settings');
        logIn();
        driver.wait(until.urlIs(baseUrl + '/o/en/settings'));
        driver.get(baseUrl + '/o/en/settings#email-password');
        driver.wait(until.elementsLocated(By.css('#email-password > div > div.h3.settings-block')));
    });

    test.it('rejects using the current email', function() {
        launchEmailModal();
        enterEmail('31@test.com');
        checkEmailFieldErrorMessageIs('New email must be different than current email.');
    });

    test.it('rejects using a non-email string', function() {
        enterEmail('abc.com');
        checkEmailFieldErrorMessageIs('Email not valid. Please check it and try again.');
    });

    test.it('rejects a blank email field', function() {
        enterEmail('');
        checkEmailFieldErrorMessageIs('This field is required. They are very strict around here.');
    });

    test.it('rejects a blank password field', function() {
        enterPassword('');
        checkPasswordFieldErrorMessageIs('This field is required. They are very strict around here.');
    });

    test.it('rejects using a taken email', function() {
        enterEmail('32@test.com');
        enterPassword('Crowdrise1!');
        submitForm();
        checkFormError('There was an error processing your request. Input validation failure');
        checkEmailFieldErrorMessageIs('Sorry, an account with that e-mail address already exists.');
    });

    test.it('rejects using an incorrect password', function() {
        enterEmail('33@test.com');
        enterPassword('crowdrise');
        submitForm();
        checkFormError('There was an error processing your request. Invalid current password.');
        checkPasswordFieldErrorMessageIs('Invalid current password.');
    });

    test.it('accepts a new email and current password', function() {
        enterEmail('33@test.com');
        enterPassword('Crowdrise1!');
        submitForm();
        ensureNoErrors();

        //reset email
        launchEmailModal();
        enterEmail('31@test.com');
        enterPassword('Crowdrise1!');
        submitForm();
        ensureNoErrors();
    });

    test.after(function() {
        driver.quit();
    });

    //SUPPORT FUNCTIONS
    
    function launchEmailModal() {
        driver.findElement(By.css('#email-password > div > button')).click();
        driver.wait(until.elementsLocated(By.css('#contained-modal-title-sm')));
    }

    function launchPasswordModal() {
        driver.findElement(By.css('#email-password > div > div:nth-child(5) > button')).click();
        driver.wait(until.elementsLocated(By.css('#contained-modal-title-sm')));
    }

    function enterEmail(email) {
        const emailField = driver.findElement(By.css('#email'));
        emailField.clear();
        emailField.click();
        emailField.sendKeys(email);
        emailField.sendKeys(Key.TAB); // allows errors to be shown
        return emailField;
    }

    function enterPassword(password) {
        const passwordField = driver.findElement(By.css('#password'));
        passwordField.clear();
        passwordField.click();
        passwordField.sendKeys(password);
        passwordField.sendKeys(Key.TAB); // allows errors to be shown
        return passwordField;
    }

    function checkEmailFieldErrorMessageIs(message) {
        const emailFieldError = driver.findElement(By.css('#email-form > div > div:nth-child(1) > div > small'));
        driver.wait(until.elementIsVisible(emailFieldError)).then(() => {
            expect('#email-form > div > div:nth-child(1) > div').dom.to.have.htmlClass('has-error');
            expect('#email-form > div > div:nth-child(1) > div > small').dom.to.have.text(message);
        });
    }

    function checkPasswordFieldErrorMessageIs(message) {
        const passwordFieldError = driver.findElement(By.css('#email-form > div > div:nth-child(2) > div > small'));
        driver.wait(until.elementIsVisible(passwordFieldError)).then(() => {
            expect('#email-form > div > div:nth-child(2) > div').dom.to.have.htmlClass('has-error');
            expect('#email-form > div > div:nth-child(2) > div > small').dom.to.have.text(message);
        });
    }

    function checkFormError(message) {
        driver.wait(until.elementsLocated(By.css('#email-form > div > div.alert')));
        expect('#email-form > div > div.alert').dom.to.have.text(message);
    }

    function submitForm() {
        const submitButton = driver.findElement(By.css('#email-form > div > div.form-submit-buttons.relative > div > button'));
        submitButton.click();
    }

    function ensureNoErrors() {
        const submitButton = driver.findElement(By.css('#email-form > div > div.form-submit-buttons.relative > div > button'));
        const modal = driver.findElement(By.css('body > div > div.fade.in.modal > div > div'));
        driver.wait(until.elementTextIs(submitButton, 'Success'));
        driver.wait(until.stalenessOf(modal));
    }
});

function logIn() {
    driver.findElement(By.id('email_address_login')).sendKeys('31@test.com');
    driver.findElement(By.id('password_login')).sendKeys('Crowdrise1!');
    driver.findElement(By.className('submit-button')).click();
}

