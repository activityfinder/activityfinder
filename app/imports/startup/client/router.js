import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { $ } from 'meteor/jquery';


/*                        LANDING ROUTE                       */

export const landingPageRouteName = 'Landing_Page';
FlowRouter.route('/', {
  name: landingPageRouteName,
  action() {
    BlazeLayout.render('Landing_Layout', { main: landingPageRouteName });
  },
});

/*                        USER ROUTES                      */


function addUserBodyClass() {
  $('body').addClass('user-layout-body');
}

function removeUserBodyClass() {
  $('body').removeClass('user-layout-body');
}

const userRoutes = FlowRouter.group({
  prefix: '/:username',
  name: 'userRoutes',
  triggersEnter: [addUserBodyClass],
  triggersExit: [removeUserBodyClass],
});


export const calendarPageRouteName = 'Calendar_Page';
userRoutes.route('/calendar', {
  name: calendarPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: calendarPageRouteName });
  },
});

export const eventCreatePageRouteName = 'Event_Create_Page';
userRoutes.route('/event', {
  name: eventCreatePageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: eventCreatePageRouteName });
  },
});


export const eventListPageRouteName = 'Event_List_Page';
userRoutes.route('/event-list', {
  name: eventListPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: eventListPageRouteName });
  },
});

/*                        MISC ROUTES                       */
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Page_Not_Found');
  },
};
