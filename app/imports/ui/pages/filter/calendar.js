import { Tracker } from 'meteor/tracker';
import { EventData } from '/imports/api/event/EventCollection';

// Define a function that checks whether a moment has already passed.
const isPast = (date) => {
  const today = moment().format();
  return moment(today).isAfter(date);
};

Template.Calendar.onCreated(() => {
  Template.instance().subscribe('EventData');
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
      const data = EventData.find().fetch().map((session) => {
        // Don't allow already past study events to be editable.
        session.editable = !isPast(session.start);
        return session;
      });

      if (data) {
        callback(data);
      }
    },

    // Configure the information displayed for an "event."
    eventRender(session, element) {
      element.find('.fc-content').html(
          `<h4 class="title">${session.title}</h4>
          <p class="time">${session.startString}</p>
          `
      );
    },

    // Triggered when a day is clicked on.
    dayClick(date, session) {
      // Store the date so it can be used when adding an event to the EventData collection.
      session.set('eventModal', { type: 'add', date: date.format() });
      // If the date has not already passed, show the create event modal.
      if (moment(date.format()).isSameOrAfter(moment(), 'day')) {
        $('#create-event-modal').modal({ blurring: true }).modal('show');
      }
      console.log(1);
    },

    // Delete an event if it is clicked on.
    eventClick(event) {
      EventData.remove({ _id: event._id });
    },

    // Allow events to be dragged and dropped.
    eventDrop(session, delta, revert) {
      const date = session.start.format();

      if (!isPast(date)) {
        const update = {
          _id: session._id,
          start: date,
          end: date,
        };

        // Update the date of the event.
        Meteor.call('editEvent', update);
      } else {
        revert();
      }
    },
  });

  // Updates the calendar if there are changes.
  Tracker.autorun(() => {
    EventData.find().fetch();
    $('#event-calendar').fullCalendar('refetchEvents');
  });
});
