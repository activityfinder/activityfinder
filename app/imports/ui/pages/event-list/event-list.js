import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Events } from '/imports/api/event/EventCollection';

Template.Event_List_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.context = Events.getSchema().namedContext('Event_List_Page');
});

Template.Event_List_Page.helpers({
  events() {
    return Events.findAll();
  },
  rsvp(peopleGoing) {
    console.log(peopleGoing);
    if (peopleGoing.indexOf(FlowRouter.getParam('username')) > -1) {
      return false;
    }
    return true;
  },
});
