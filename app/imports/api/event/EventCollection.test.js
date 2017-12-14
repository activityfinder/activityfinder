import { Events } from '/imports/api/events/EventCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('InterestCollection', function testSuite() {
    const date = '12/21/17';
    const owner = 'jlam890';
    const title = 'Ice Cream Social';
    const location = 'Ben & Jerry\'s';
    const start = '8:00 am';
    const end = '10:00 am';
    const interests = ['Food'];
    const description = 'Free ice cream and free admission! Show up to mingle with your peers. Please RSVP so we know how much ice cream to buy.';
    const image = '/images/ice-cream.jpg';
    const peopleGoing = ['jlam890'];
    const defineObject = { date, owner, title, location, start, end, interests, description, image, peopleGoing };

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Events.define(defineObject);
      expect(Events.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Events.findDoc(docID);
      expect(doc.date).to.equal(date);
      expect(doc.description).to.equal(description);
      // Check that multiple definitions with the same name fail
      expect(function foo() { Events.define(defineObject); }).to.throw(Error);
      // Check that we can dump and restore a Interest.
      const dumpObject = Events.dumpOne(docID);
      Events.removeIt(docID);
      expect(Events.isDefined(docID)).to.be.false;
      docID = Events.restoreOne(dumpObject);
      expect(Events.isDefined(docID)).to.be.true;
      Events.removeIt(docID);
    });

    it('#findID, #findIDs', function test() {
      const docID = Events.define(defineObject);
      expect(Events.isDefined(docID)).to.be.true;
      const docID2 = Events.findID(name);
      expect(docID).to.equal(docID2);
      Events.findIDs([name, name]);
      Events.removeIt(docID);
    });
  });
}

