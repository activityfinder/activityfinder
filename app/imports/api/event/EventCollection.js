import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Profile */

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class EventCollection extends BaseCollection {

  /**
   * Creates the Profile collection.
   */
  constructor() {
    super('Event', new SimpleSchema({
      username: { type: String },
      name: { type: String },
      // Remainder are optional
      location: { type: String },
      date: { type: Date },
      time: { type: String },
      interests: { type: Array, optional: true },
      'interests.$': { type: String },
      description: { type: String },
      image: { type: SimpleSchema.RegEx.Url, optional: true },
    }, { tracker: Tracker }));
  }

  define({ username, name = '', location = '', date = '', time = '', interests = [], description = '', image = '' }) {
    // make sure required fields are OK.
    const checkPattern = {
      name: String,
      location: String,
      username: String,
      image: String,
      description: String,
      date: Date,
      time: String,
    };
    check({ name, location, username, image, description, date, time }, checkPattern);

    if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Profile`);
    }

    // Throw an error if any of the passed Interest names are not defined.
    Interests.assertNames(interests);

    // Throw an error if there are duplicates in the passed interest names.
    if (interests.length !== _.uniq(interests).length) {
      throw new Meteor.Error(`${interests} contains duplicates`);
    }

    return this._collection.insert({ name, username, location, date, time, interests, description, image });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const username = doc.username;
    const location = doc.location;
    const date = doc.date;
    const time = doc.time;
    const interests = doc.interests;
    const description = doc.description;
    const image = doc.image;
    return { name, username, location, date, time, interests, description, image };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Events = new EventCollection();
