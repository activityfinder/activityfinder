import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Events } from '/imports/api/event/EventCollection';
import { Interests } from '/imports/api/interest/InterestCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';
const selectedInterestsKey = 'selectedInterests';

Template.Event_Create_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Events.getSchema().namedContext('Event_Create_Page');
  this.messageFlags.set(selectedInterestsKey, undefined);
});

Template.Event_Create_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  interests() {
    /* const event = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = event.interests;
    return event && _.map(Interests.findAll(),
            function makeInterestObject(interest) {
              return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
            });
    */
    return _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return {
            label: interest.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), interest.name),
          };
        });
  },
});

Template.Event_Create_Page.events({
  'submit .event-data-form'(event, instance) {
    event.preventDefault();
    const date = event.target.Date.value;
    const owner = FlowRouter.getParam('username');
    let title = event.target.Title.value;
    const start = event.target.Start.value;
    const end = event.target.End.value; // schema requires username.
    const location = event.target.Location.value;
    const description = event.target.Description.value;
    const image = event.target.Image.value;
    const peopleGoing = [FlowRouter.getParam('username')];
    const selectedInterests = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);
    if (Events.findEvent(title)) {
      let newName = prompt('This title for an event already exists! Please enter in another name to avoid confusion. Thank you!');
      while (newName === title) {
        newName = prompt('This title for an event already exists! Please enter in another name to avoid confusion. Thank you!');
      }
      title = newName;
    }

    const newEventData = {
      date,
      owner,
      title,
      start,
      end,
      location,
      description,
      image,
      interests,
      peopleGoing,
    };
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Events.getSchema().clean(newEventData);
    // Determine validity.
    instance.context.validate(cleanData);
    console.log(cleanData);

    if (instance.context.isValid()) {
      Events.insert(cleanData);
      instance.messageFlags.set(displaySuccessMessage, true);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

