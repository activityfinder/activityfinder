import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
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
    if (peopleGoing.indexOf(FlowRouter.getParam('username')) > -1) {
      return false;
    }
    return true;
  },
});

Template.Event_List_Page.events({
  'click .event-info-card'(event) {
    event.preventDefault();
    console.log(event.currentTarget.firstElementChild.innerText);
    const currentEvent = Events.findEvent(event.currentTarget.firstElementChild.innerText);
    const index = currentEvent.peopleGoing.indexOf(FlowRouter.getParam('username'));
    if (index > -1) {
      const newArray = currentEvent.peopleGoing;
      newArray.splice(index, 1);
      currentEvent.peopleGoing = newArray;
      Events.update(currentEvent._id, { $set: currentEvent });
    } else {
      const newArray = currentEvent.peopleGoing;
      newArray.push(FlowRouter.getParam('username'));
      currentEvent.peopleGoing = newArray;
      Events.update(currentEvent._id, { $set: currentEvent });
    }
  },
});

