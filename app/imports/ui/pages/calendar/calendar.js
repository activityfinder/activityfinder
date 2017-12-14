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

Template.Calendar.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
});

Template.Calendar.onCreated(() => {
  Template.instance().subscribe('EventCollection');
});

Template.Calendar.onRendered(() => {
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
        session.time = `${session.start} to ${session.end}`; // eslint-disable-line no-param-reassign
        session.start = Date.parse(session.date); // eslint-disable-line no-param-reassign
        session.end = Date.parse(session.date); // eslint-disable-line no-param-reassign
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
      const interests = _.reduce(session.interests, function (item, list) {
        list += ','; // eslint-disable-line
        list += item; // eslint-disable-line
        return list;
      });
      element.find('.fc-content').html(
          `<h5 class="title">${session.title}</h5>
          <p class="time">${session.time}</p>
          <p style="display:none" class="interests">${interests}</p>
          `,
      );
      $(element).attr('href', `/${FlowRouter.getParam('username')}/event-list`);
    },

    // Triggered when a day is clicked on.
    dayClick(date) {
      // Store the date so it can be used when adding an event to the EventData collection.
      Session.set('eventModal', { type: 'add', date: date.format() }); // eslint-disable-line
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
