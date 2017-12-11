import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Events } from '/imports/api/event/EventCollection';

Template.Event_List.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
});

Template.Event_List.helpers({
  events() {
    return Events.findAll();
  },
});
