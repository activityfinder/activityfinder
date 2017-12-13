import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { moment } from 'meteor/momentjs:moment';
import { Events } from '/imports/api/event/EventCollection';
import { Session } from 'meteor/session';
import { Interests } from '/imports/api/interest/InterestCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';

const selectedInterestsKey = 'selectedInterests';

Template.Calendar_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, undefined);
  Template.instance().subscribe('EventCollection');
});

Template.Calendar_Page.helpers({
  eventList() {
    // Initialize selectedInterests to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allEvents = Events.findAll();
    const selectedInterests = Template.instance().messageFlags.get(selectedInterestsKey);
    return _.filter(allEvents, eventss => _.intersection(eventss.interests, selectedInterests).length > 0);
  },

  interests() {
    return _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return {
            label: interest.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), interest.name),
          };
        });
  },
});
/*
Template.Calendar_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedInterestsKey, _.map(selectedOptions, (option) => option.value));
  },
});
*/
Template.Calendar_Page.onRendered(() => {
  // Initialize the calendar.
  $('#event-calendar').fullCalendar({
    // Define the navigation buttons.
    header: {
      left: 'title',
      center: '',
      right: 'today prev,next',
    },
    // Add events to the calendar.
    events(start, end, timezone, callback) {
      const data = Events.findAll().map((session) => {
        console.log('it got here');
        session.time = `${session.start} to ${session.end}`; // eslint-disable-line no-param-reassign
        session.start = Date(session.date); // eslint-disable-line no-param-reassign
        session.end = Date(session.date); // eslint-disable-line no-param-reassign
        // set event red if you're in it
        if (_.find(session.peopleGoing, function (username) {
          return username === FlowRouter.getParam('username');
        })) {
          session.backgroundColor = '#db2828'; // eslint-disable-line no-param-reassign
          session.borderColor = '#db2828'; // eslint-disable-line no-param-reassign
        }
        return session;
      });

      if (data) {
        callback(data);
      }
    },

    // Configure the information displayed for an "event."
    eventRender(session, element) {
      element.find('.fc-content').html(
          `<h5 class="title">${session.title}</h5>
          <p class="time">${session.time}</p>
          `,
      );
    },

    // Triggered when a day is clicked on.
    dayClick(date) {
      // Store the date so it can be used when adding an event to the EventData collection.
      Session.set('eventModal', { type: 'add', date: date.format() });
      // If the date has not already passed, show the create event modal.
      if (date.isAfter(moment())) {
        $('#create-event-modal').modal({ blurring: true }).modal('show');
      }
    },
  });

  // Updates the calendar if there are changes.
  Tracker.autorun(() => {
    Events.find().fetch();
    $('#event-calendar').fullCalendar('refetchEvents');
  });
});

