/* CrowdRise Example Tests - Created by Todd Williams */

const { Builder } = require('selenium-webdriver'),
      { expect } = require('chai');

const driver = new Builder()
    .forBrowser('chrome')
    .build();

const cr = require('../Support/Core')(driver),
      email = require('../Support/Email')(driver),
      password = require('../Support/Password')(driver);

// Test Cases

describe('CrowdRise Example Tests', function() {

    describe('Account Settings', function() {

        before(async function() {
            await cr.logIn();
            await email.loadPage();
        });

        describe('Email & Password', function() {

            it('Displays current email', async function() {
                const currentEmail = await email.getDisplayEmail();
                expect(currentEmail).to.equal(cr.email);
            });

            describe('Updating the Email', function() {

                before(async function() {
                    await email.openEmailModal();
                })

                it('Email is required', async function() {
                    await email.enterEmail('');
                    const error = await email.getEmailFieldError();
                    expect(error).to.equal('This field is required. They are very strict around here.');
                });

                it('Email must be valid', async function() {
                    await email.enterEmail('123');
                    const error = await email.getEmailFieldError();
                    expect(error).to.equal('Email not valid. Please check it and try again.');
                });

                it('Email must be different than current email', async function() {
                    await email.enterEmail('1example@test.com');
                    const error = await email.getEmailFieldError();
                    expect(error).to.equal('New email must be different than current email.');
                });

                it('Password is required', async function() {
                    await email.enterPassword('');
                    const error = await email.getPasswordFieldError();
                    expect(error).to.equal('This field is required. They are very strict around here.');
                });

                it('Password must be correct', async function() {
                    await email.enterEmail('updatedEmail@test.com');
                    await email.enterPassword('incorrectPassword');
                    await email.submitExpectingError();
                    const error = await email.getModalError();
                    expect(error).to.equal('There was an error processing your request. Access Denied');
                });

                it('Can successfully update the email', async function() {
                    await email.enterEmail('updatedEmail@test.com');
                    await email.enterPassword(cr.password);
                    await email.submit();
                    const displayEmail = await email.getDisplayEmail();
                    expect(displayEmail).to.equal('updatedEmail@test.com');

                    // revert email
                    await email.openEmailModal();
                    await email.enterEmail('1example@test.com');
                    await email.enterPassword(cr.password);
                    await email.submit();
                });
            });

            describe('Updating the Password', function() {

                before(async function() {
                    await password.openPasswordModal();
                })

                it('Current Password is required', async function() {
                    await password.enterCurrentPassword('');
                    const error = await password.getCurrentPasswordFieldError();
                    expect(error).to.equal('This field is required. They are very strict around here.');
                });

                it('New Password is required', async function() {
                    await password.enterNewPassword('');
                    const error = await password.getNewPasswordFieldError();
                    expect(error).to.equal('This field is required. They are very strict around here.');
                });

                it('Confirm New Password is required', async function() {
                    await password.enterConfirmNewPassword('');
                    const error = await password.getConfirmNewPasswordFieldError();
                    expect(error).to.equal('This field is required. They are very strict around here.');
                });

                it('New Password must be 8+ characters', async function() {
                    await password.enterNewPassword('Abc123!');
                    const error = await password.getNewPasswordFieldError();
                    expect(error).to.equal('Must be more than 8 characters in length.');
                });

                it('New Password must contain 1 uppercase character', async function() {
                    await password.enterNewPassword('abcd1234!');
                    const error = await password.getNewPasswordFieldError();
                    expect(error).to.equal('One capital letter required.');
                });

                it('New Password must contain 1 lowercase character', async function() {
                    await password.enterNewPassword('ABCD1234!');
                    const error = await password.getNewPasswordFieldError();
                    expect(error).to.equal('One lowercase letter required.');
                });

                it('New Password must contain 1 special character', async function() {
                    await password.enterNewPassword('Abcd12345');
                    const error = await password.getNewPasswordFieldError();
                    expect(error).to.equal('One special character required.');
                });

                it('New Password must contain 1 number', async function() {
                    await password.enterNewPassword('Abcdefg!');
                    const error = await password.getNewPasswordFieldError();
                    expect(error).to.equal('One number required.');
                });

                it('Requirements list dynamically updates', async function() {
                    await password.enterNewPassword('P');
                    let failedReqs = await password.getFailedRequirements();
                    expect(failedReqs).to.deep.equal([
                        '  8+ characters',
                        '  1 lowercase character',
                        '  1 special character',
                        '  1 number'
                    ]);
                    await password.enterNewPassword('Pass');
                    failedReqs = await password.getFailedRequirements();
                    expect(failedReqs).to.deep.equal([
                        '  8+ characters',
                        '  1 special character',
                        '  1 number'
                    ]);
                    await password.enterNewPassword('Password');
                    failedReqs = await password.getFailedRequirements();
                    expect(failedReqs).to.deep.equal([
                        '  1 special character',
                        '  1 number'
                    ]);
                    await password.enterNewPassword('Password1');
                    failedReqs = await password.getFailedRequirements();
                    expect(failedReqs).to.deep.equal([
                        '  1 special character'
                    ]);
                    await password.enterNewPassword('Password1!');
                    failedReqs = await password.getFailedRequirements();
                    expect(failedReqs).to.be.empty;
                });

                it('Confirm New Password must match New Password', async function() {
                    await password.enterNewPassword('Password1!');
                    await password.enterConfirmNewPassword('Password2!');
                    const error = await password.getConfirmNewPasswordFieldError();
                    expect(error).to.equal('Field must match corresponding field.');
                });

                it('Current Password must be correct'); // pending

                it('Can successfully update the password'); // pending
            });
        });

        after(async function() {
            await driver.quit();
        });
    });
});
