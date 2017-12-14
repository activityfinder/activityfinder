import { Accounts } from 'meteor/accounts-base';

/* eslint-disable no-console */

/* Create a profile document for this user if none exists already. */
Accounts.validateNewUser(function validate(user) {
  // All UH users are valid for Activity Finder.
  return true;
});
