import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { Events } from '/imports/api/event/EventCollection';
import { Interests } from '/imports/api/interest/InterestCollection';

const selectedInterestsKey = 'selectedInterests';

Template.Calendar_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, undefined);
});

Template.Calendar_Page.helpers({
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

Template.Calendar_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedInterestsKey, _.map(selectedOptions, (option) => option.value));
    const arr = _.map(selectedOptions, (option) => option.value);
    if (selectedOptions.length > 0) {
      $('.fc-content .interests').each(function () {
        const interests = $(this).text().split(',');
        if (_.intersection(interests, arr).length === 0) {
          $(this).parent().parent().parent()
              .css('visibility', 'hidden');
        }
      });
    } else {
      $('.fc-content .interests').each(function () {
        $(this).parent().parent().parent()
            .css('visibility', 'visible');
      });
    }
  },
});

