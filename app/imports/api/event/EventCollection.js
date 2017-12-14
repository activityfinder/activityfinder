/* eslint-disable max-len */
import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Event */

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class EventCollection extends BaseCollection {

  /**
   * Creates the Event collection.
   */
  constructor() {
    super('Event', new SimpleSchema({
      date: { type: String },
      owner: { type: String },
      title: { type: String },
      location: { type: String},
      start: { type: String },
      end: { type: String },
      interests: { type: Array, optional: true },
      'interests.$': { type: String },
      description: { type: String, optional: true },
      image: { type: SimpleSchema.RegEx.Url, optional: true },
      peopleGoing: { type: Array, optional: true },
      'peopleGoing.$': { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /** Possibly an error because owner might not have to be initialized as '' */
  define({ date = '', owner = '', title = '', location = '', start = '', end = '', interests = [], description = '', image = '', peopleGoing = [] }) {
    // make sure required fields are OK.
    const checkPattern = {
      date: String,
      owner: String,
      title: String,
      location: String,
      start: String,
      end: String,
      description: String,
      image: String,
    };
    check({ date, owner, title, location, start, end, description, image }, checkPattern);

// Throw an error if any of the passed Interest names are not defined.
    Interests.assertNames(interests);

// Throw an error if there are duplicates in the passed interest names.
    if (interests.length !== _.uniq(interests).length) {
      throw new Meteor.Error('$ {interests}contains duplicates');
    }

    return this._collection.insert({ date, owner, title, location, start, end, interests, description, image, peopleGoing });
  }

  /**
   * Returns an object representing the Event docID in a format acceptable to define().
   * @param docID The docID of a Event.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const date = doc.date;
    const owner = doc.owner;
    const title = doc.title;
    const location = doc.location;
    const start = doc.start;
    const end = doc.end;
    const interests = doc.interests;
    const description = doc.description;
    const image = doc.image;
    const peopleGoing = doc.peopleGoing;
    return { date, owner, title, location, start, end, interests, description, image, peopleGoing };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Events = new EventCollection();
