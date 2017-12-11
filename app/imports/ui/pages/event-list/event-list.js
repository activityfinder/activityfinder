import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Events } from '/imports/api/event/EventCollection';

Template.Filter_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
});

Template.Filter_Page.helpers({
  eventss() {
    // Find all profiles with the currently selected interests.
    const allEvents = Events.findAll();
    return allEvents;
  },
});
