import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Events } from '/imports/api/event/EventCollection';

Template.Event_List_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
});

Template.Event_List_Page.helpers({
  events() {
    return Events.findAll();
  },
});
