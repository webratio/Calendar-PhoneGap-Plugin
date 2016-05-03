function createStubs() {

    return {
        Calendar: {
            createCalendar: function(mergedOptions) {
                console.log("createCalendar", mergedOptions);
            },
            deleteCalendar: function(calendarName) {
                console.log("deleteCalendar", calendarName);
            },
            openCalendar: function(date) {
                console.log("openCalendar", date);
            },
            createEventWithOptions: function(data) {
                console.log("createEventWithOptions", data);
            },
            createEventInteractively: function(data) {
                console.log("createEventInteractively", data);
            },
            createEventInNamedCalendar: function(data) {
                console.log("createEventInNamedCalendar", data);
            },
            deleteEvent: function(data) {
                console.log("deleteEvent", data);
            },
            deleteEventFromNamedCalendar: function(data) {
                console.log("deleteEventFromNamedCalendar", data);
            },
            findEvent: function(data) {
                console.log("findEvent", data);
            },
            findAllEventsInNamedCalendar: function(calendarName) {
                console.log("findAllEventsInNamedCalendar", calendarName);
            },
            modifyEvent: function(data) {
                console.log("modifyEvent", data);
            },
            modifyEventInNamedCalendar: function(data) {
                console.log("modifyEventInNamedCalendar", data);
            },
            listEventsInRange: function(data) {
                console.log("listEventsInRange", data);
            },
            listCalendars: function(data) {
                console.log("listCalendars", data);
            }
        }
    };
};