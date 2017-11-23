import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Events } from '/imports/api/event/EventCollection';
import { Interests } from '/imports/api/interest/InterestCollection';

/* eslint-disable no-param-reassign */

const displayErrorMessages = 'displayErrorMessages';
const displaySuccessMessage = 'displaySuccessMessage';

Template.Event_Info_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displayErrorMessages, false);
  this.messageFlags.set(displaySuccessMessage, false);
  this.context = Events.getSchema().namedContext('Event_Info_Page');
});

Template.Event_Info_Page.helpers({
  eventDataField(fieldName) {
    const eventData = Events.findOne(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return eventData && eventData[fieldName];
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
});
